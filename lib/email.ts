import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const FROM = "TriniMarket <no-reply@trinimarket.tt>";

// ─── Subscription expiry reminder ────────────────────────────────────────────

export async function sendSubscriptionReminder({
  toEmail,
  toName,
  tier,
  listingTitle,
  expiresAt,
  amountTTD,
}: {
  toEmail: string;
  toName: string;
  tier: "featured" | "premium";
  listingTitle: string;
  expiresAt: string;
  amountTTD: number;
}) {
  const tierLabel = tier === "featured" ? "◆ Featured" : "★ Premium";
  const expiryDate = new Date(expiresAt).toLocaleDateString("en-TT", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const renewUrl = `${APP_URL}/wallet`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1d4ed8;padding:28px 32px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#2563eb;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                    <span style="color:#ffffff;font-weight:700;font-size:14px;">TM</span>
                  </td>
                  <td style="padding-left:10px;">
                    <span style="color:#ffffff;font-size:20px;font-weight:700;">TriniMarket</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">
                Your ${tierLabel} plan expires soon
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">
                Hi ${toName}, just a heads-up that your subscription is expiring.
              </p>

              <!-- Subscription card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:0.05em;">Listing</p>
                    <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">${listingTitle}</p>

                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background:#dbeafe;border:1px solid #bfdbfe;border-radius:6px;padding:3px 10px;">
                          <span style="font-size:12px;font-weight:600;color:#1d4ed8;">${tierLabel}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
                      <strong style="color:#ef4444;">Expires:</strong> ${expiryDate}
                    </p>
                    <p style="margin:4px 0 0;font-size:14px;color:#6b7280;">
                      <strong>Renewal amount:</strong> TT$${amountTTD}/month
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.6;">
                After your plan expires your listing will return to <strong>free tier</strong> — it won't be removed, but it will lose its boosted placement, badge, and homepage visibility.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:#1d4ed8;border-radius:10px;">
                    <a href="${renewUrl}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Renew Plan — TT$${amountTTD}
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 0;font-size:13px;color:#9ca3af;">
                Or log in to your <a href="${APP_URL}/dashboard" style="color:#2563eb;">Dashboard</a> to manage your subscription.
                You can cancel anytime with no penalty.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                © ${new Date().getFullYear()} TriniMarket · Trinidad &amp; Tobago's Marketplace<br />
                <a href="${APP_URL}" style="color:#6b7280;">Visit TriniMarket</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Your ${tierLabel} plan expires ${expiryDate} — Renew to keep your boost`,
    html,
  });
}

// ─── Welcome email after signup ───────────────────────────────────────────────

export async function sendWelcomeEmail({
  toEmail,
  toName,
}: {
  toEmail: string;
  toName: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#1d4ed8;padding:28px 32px;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:#2563eb;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                  <span style="color:#ffffff;font-weight:700;font-size:14px;">TM</span>
                </td>
                <td style="padding-left:10px;"><span style="color:#ffffff;font-size:20px;font-weight:700;">TriniMarket</span></td>
              </tr></table>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Welcome to TriniMarket, ${toName}! 🎉</p>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">You're now part of Trinidad &amp; Tobago's marketplace. Here's how to get started:</p>

              ${[
                ["📋", "Post your first listing", "List anything — vehicles, electronics, services and more.", "/listings/new"],
                ["⚡", "Boost your listing", "Upgrade to Featured or Premium for more visibility.", "/pricing"],
                ["🏪", "Browse local businesses", "Discover verified businesses across T&T.", "/businesses"],
              ].map(([icon, title, desc, href]) => `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="44" style="vertical-align:top;padding-top:2px;">
                    <span style="font-size:24px;">${icon}</span>
                  </td>
                  <td>
                    <p style="margin:0 0 2px;font-size:15px;font-weight:600;color:#111827;">${title}</p>
                    <p style="margin:0 0 4px;font-size:14px;color:#6b7280;">${desc}</p>
                    <a href="${APP_URL}${href}" style="font-size:13px;color:#2563eb;text-decoration:none;">Get started →</a>
                  </td>
                </tr>
              </table>`).join("")}

              <table cellpadding="0" cellspacing="0" style="margin-top:8px;">
                <tr>
                  <td style="background:#1d4ed8;border-radius:10px;">
                    <a href="${APP_URL}/listings/new" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                      Post Your First Listing →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                © ${new Date().getFullYear()} TriniMarket · Trinidad &amp; Tobago's Marketplace
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Welcome to TriniMarket, ${toName}! 🎉`,
    html,
  });
}

// ─── New message notification ─────────────────────────────────────────────────

export async function sendNewMessageEmail({
  toEmail,
  toName,
  fromName,
  listingTitle,
  messagePreview,
  messagesUrl,
}: {
  toEmail: string;
  toName: string;
  fromName: string;
  listingTitle: string;
  messagePreview: string;
  messagesUrl?: string;
}) {
  const url = messagesUrl ?? `${APP_URL}/messages`;
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#1d4ed8;padding:28px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#2563eb;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-weight:700;font-size:14px;">TM</span>
              </td>
              <td style="padding-left:10px;"><span style="color:#ffffff;font-size:20px;font-weight:700;">TriniMarket</span></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">New message from ${fromName} 💬</p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hi ${toName}, someone sent you a message about your listing.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr><td>
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;">Listing</p>
                <p style="margin:0 0 16px;font-size:15px;font-weight:600;color:#111827;">${listingTitle}</p>
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;">Message</p>
                <p style="margin:0;font-size:15px;color:#374151;font-style:italic;">&ldquo;${messagePreview}&rdquo;</p>
              </td></tr>
            </table>

            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#1d4ed8;border-radius:10px;">
                  <a href="${url}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                    Reply in Messages →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">© ${new Date().getFullYear()} TriniMarket · Trinidad &amp; Tobago's Marketplace</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `${fromName} sent you a message about "${listingTitle}"`,
    html,
  });
}

// ─── Listing posted confirmation ──────────────────────────────────────────────

export async function sendListingPostedEmail({
  toEmail,
  toName,
  listingTitle,
  listingId,
  tier,
}: {
  toEmail: string;
  toName: string;
  listingTitle: string;
  listingId: string;
  tier: string;
}) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#1d4ed8;padding:28px 32px;">
            <table cellpadding="0" cellspacing="0"><tr>
              <td style="background:#2563eb;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                <span style="color:#ffffff;font-weight:700;font-size:14px;">TM</span>
              </td>
              <td style="padding-left:10px;"><span style="color:#ffffff;font-size:20px;font-weight:700;">TriniMarket</span></td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#111827;">Your listing is live! 🚀</p>
            <p style="margin:0 0 24px;font-size:15px;color:#6b7280;">Hi ${toName}, your listing has been posted successfully.</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;border-radius:12px;padding:20px;margin-bottom:24px;">
              <tr><td>
                <p style="margin:0 0 4px;font-size:12px;color:#9ca3af;text-transform:uppercase;">Listing</p>
                <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#111827;">${listingTitle}</p>
                <p style="margin:0;font-size:14px;color:#6b7280;">Tier: <strong style="color:#111827;text-transform:capitalize;">${tier}</strong></p>
              </td></tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background:#1d4ed8;border-radius:10px;">
                  <a href="${APP_URL}/listings/${listingId}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">
                    View Your Listing →
                  </a>
                </td>
              </tr>
            </table>

            ${tier === "free" ? `<p style="margin:0;font-size:13px;color:#9ca3af;">Want more visibility? <a href="${APP_URL}/pricing" style="color:#2563eb;">Upgrade to Featured or Premium</a> to appear at the top of search results.</p>` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f3f4f6;">
            <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">© ${new Date().getFullYear()} TriniMarket · Trinidad &amp; Tobago's Marketplace</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();

  return resend.emails.send({
    from: FROM,
    to: toEmail,
    subject: `Your listing "${listingTitle}" is now live on TriniMarket`,
    html,
  });
}
