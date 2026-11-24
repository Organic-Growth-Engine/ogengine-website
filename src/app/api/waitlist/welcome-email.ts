// Thank-you email sent to each new waitlist subscriber, via Resend (https://resend.com).
// Needs RESEND_API_KEY and WAITLIST_FROM_EMAIL; WAITLIST_REPLY_TO is optional.

const SUBJECT = "Welcome to the OG Engine waitlist";

const TEXT = `Hi,

Thanks for joining the OG Engine waitlist.

You'll be among the first to hear when Origin, our first product, opens. Origin brings 15+ social media platforms into one place. We'll also email you when the next MOSS products are ready.

We only email about OG Engine products, and not often.

— The OG Engine team
https://ogengine.co`;

const HTML = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f3ef;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f3ef;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:14px;">
            <tr>
              <td style="padding:36px 32px;font-family:Montserrat,'Avenir Next',Helvetica,Arial,sans-serif;color:#0f0b08;">
                <p style="margin:0 0 24px;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;color:#8a5312;">OG Engine</p>
                <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;font-weight:500;letter-spacing:-0.02em;">Welcome to the waitlist</h1>
                <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#3d3630;">Thanks for joining. You'll be among the first to hear when <b>Origin</b>, our first product, opens. Origin brings 15+ social media platforms into one place.</p>
                <p style="margin:0 0 14px;font-size:16px;line-height:1.55;color:#3d3630;">We'll also email you when the next MOSS products are ready.</p>
                <p style="margin:0 0 28px;font-size:16px;line-height:1.55;color:#3d3630;">We only email about OG Engine products, and not often.</p>
                <a href="https://ogengine.co" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#0f0b08;color:#ffffff;font-size:15px;text-decoration:none;">Visit ogengine.co</a>
                <p style="margin:32px 0 0;font-size:14px;color:#5c544c;">— The OG Engine team</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

export async function sendWelcomeEmail(to: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;
  if (!apiKey || !from) {
    console.warn("Welcome email skipped: RESEND_API_KEY or WAITLIST_FROM_EMAIL not set");
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        // Resend drops a repeat of the same key, so a retried request can't email twice.
        "Idempotency-Key": `waitlist-welcome/${to}`,
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: SUBJECT,
        html: HTML,
        text: TEXT,
        ...(process.env.WAITLIST_REPLY_TO ? { reply_to: process.env.WAITLIST_REPLY_TO } : {}),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Welcome email failed:", res.status, await res.text().catch(() => ""));
    }
  } catch (err) {
    console.error("Welcome email failed:", err);
  }
}
