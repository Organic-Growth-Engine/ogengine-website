
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    // Basic spam trap
    if (body.website) {
      return NextResponse.json({ success: true });
    }

    // Validate email
    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
      console.error("Supabase configuration missing");
      return NextResponse.json(
        { error: "Service unavailable." },
        { status: 503 }
      );
    }

    const response = await fetch(
      `${url}/rest/v1/waitlist_subscribers`,
      {
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
      }
    );

    if (response.status === 409) {
      return NextResponse.json({
        success: true,
        message: "Already registered.",
      });
    }

    if (!response.ok) {
      console.error(
        "Supabase insert failed:",
        response.status
      );

      return NextResponse.json(
        { error: "Unable to save your email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
