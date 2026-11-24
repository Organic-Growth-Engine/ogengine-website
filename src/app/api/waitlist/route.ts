import { NextResponse } from "next/server";
import { resolveMx, resolve4, resolve6 } from "node:dns/promises";

// DNS lookups need the Node.js runtime.
export const runtime = "nodejs";

// Throwaway inbox providers we don't accept.
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com",
  "10minutemail.com", "10minutemail.net", "tempmail.com", "temp-mail.org",
  "tempmail.net", "tempmailo.com", "throwawaymail.com", "yopmail.com",
  "yopmail.net", "getnada.com", "nada.email", "trashmail.com", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "fakeinbox.com", "emailondeck.com",
  "mintemail.com", "mohmal.com", "moakt.com", "spamgourmet.com", "burnermail.io",
  "mailpoof.com", "tempr.email", "discard.email", "inboxkitten.com",
  "1secmail.com", "1secmail.org", "1secmail.net", "mail.tm", "emailfake.com",
]);

// Domains people commonly mistype.
const TYPO_DOMAINS: Record<string, string> = {
  "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gamil.com": "gmail.com",
  "gmail.co": "gmail.com", "gmail.con": "gmail.com", "gmal.com": "gmail.com",
  "gnail.com": "gmail.com", "hotmial.com": "hotmail.com", "hotmail.co": "hotmail.com",
  "hotmai.com": "hotmail.com", "outlok.com": "outlook.com", "outllok.com": "outlook.com",
  "yaho.com": "yahoo.com", "yahooo.com": "yahoo.com", "yahoo.co": "yahoo.com",
  "iclod.com": "icloud.com", "icloud.co": "icloud.com",
};

const LOCAL_RE = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

type Check = { ok: true } | { ok: false; error: string };

function checkFormat(email: string): Check {
  const invalid = { ok: false as const, error: "Enter a valid email address, like name@company.com." };
  if (!email || email.length > 254) return invalid;
  const at = email.lastIndexOf("@");
  if (at < 1 || at !== email.indexOf("@")) return invalid;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (local.length > 64 || !LOCAL_RE.test(local)) return invalid;
  const labels = domain.split(".");
  if (labels.length < 2 || !labels.every((l) => LABEL_RE.test(l))) return invalid;
  if (!/^[a-z]{2,63}$/.test(labels[labels.length - 1])) return invalid;

  const suggestion = TYPO_DOMAINS[domain];
  if (suggestion) {
    return { ok: false, error: `Did you mean ${local}@${suggestion}?` };
  }
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { ok: false, error: "Temporary email addresses can't join. Use your regular email." };
  }
  return { ok: true };
}

const withTimeout = <T,>(p: Promise<T>, ms: number) =>
  Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("ETIMEOUT")), ms))]);

const isMissing = (err: unknown) => {
  const code = (err as { code?: string })?.code;
  return code === "ENOTFOUND" || code === "ENODATA" || code === "ENODOMAIN" || code === "ESERVFAIL";
};

/** True if the domain can receive mail. DNS outages are not held against the user. */
async function domainAcceptsMail(domain: string): Promise<boolean> {
  try {
    const mx = await withTimeout(resolveMx(domain), 4000);
    // A single "." MX (RFC 7505) means the domain explicitly accepts no mail.
    if (mx.length === 1 && (mx[0].exchange === "" || mx[0].exchange === ".")) return false;
    if (mx.length > 0) return true;
  } catch (err) {
    if (!isMissing(err)) return true;
  }
  // No MX record: mail falls back to the domain's address record (RFC 5321).
  try {
    const a = await withTimeout(resolve4(domain).catch(() => resolve6(domain)), 3000);
    return a.length > 0;
  } catch (err) {
    return !isMissing(err);
  }
}

async function validate(email: string): Promise<Check> {
  const format = checkFormat(email);
  if (!format.ok) return format;
  if (!(await domainAcceptsMail(email.split("@")[1]))) {
    return { ok: false, error: "That email domain can't receive mail. Check the spelling." };
  }
  return { ok: true };
}

const normalize = (v: unknown) => (typeof v === "string" ? v.trim().toLowerCase() : "");

/** Live check while typing: format and mail domain only (never reveals who has joined). */
export async function GET(request: Request) {
  const email = normalize(new URL(request.url).searchParams.get("email"));
  const result = await validate(email);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    // The launch page's form posts FormData; older clients send JSON.
    const contentType = request.headers.get("content-type") ?? "";
    let body: { email?: unknown; website?: unknown };
    if (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    ) {
      const form = await request.formData();
      body = { email: form.get("email"), website: form.get("website") };
    } else {
      body = await request.json();
    }

    // Basic spam trap
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    const email = normalize(body.email);
    const result = await validate(email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error, field: "email" }, { status: 422 });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
      console.error("Supabase configuration missing");
      return NextResponse.json(
        { error: "The waitlist is unavailable right now. Try again shortly." },
        { status: 503 }
      );
    }

    const response = await fetch(`${url}/rest/v1/waitlist_subscribers`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
        consent_version: "local-test-v1",
        source: "website",
      }),
      cache: "no-store",
    });

    if (response.status === 409) {
      return NextResponse.json(
        { error: "This email is already on the waitlist.", field: "email" },
        { status: 409 }
      );
    }

    if (!response.ok) {
      console.error("Supabase insert failed:", response.status);
      return NextResponse.json(
        { error: "We couldn't save your email. Try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
