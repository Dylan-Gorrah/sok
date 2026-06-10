export function magicLinkEmail({ url, email }: { url: string; email: string }) {
  const host = new URL(url).host;

  return {
    subject: `Your Sok sign-in link`,
    text: `Sign in to Sok\n\nClick the link below to sign in. It expires in 10 minutes.\n\n${url}\n\nIf you didn't request this, ignore this email.\n\n— Sok`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sign in to Sok</title>
</head>
<body style="margin:0;padding:0;background-color:#F7F1E8;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F7F1E8;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

          <!-- Logo / wordmark -->
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <span style="font-family:'Georgia',serif;font-size:28px;color:#2B211B;letter-spacing:-0.5px;">
                Sok
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#FDFBF7;border:1px solid #E3D7C5;border-radius:4px;padding:40px 36px;">

              <h1 style="margin:0 0 8px;font-family:'Georgia',serif;font-size:22px;font-weight:400;color:#2B211B;line-height:1.3;">
                Your sign-in link
              </h1>
              <p style="margin:0 0 28px;font-family:Arial,sans-serif;font-size:14px;color:#6B5847;line-height:1.6;">
                Click the button below to sign in to <strong style="color:#2B211B;">${host}</strong>. This link expires in 10 minutes.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="background-color:#6F4E37;border-radius:2px;">
                    <a href="${url}"
                      style="display:inline-block;padding:14px 32px;font-family:Arial,sans-serif;font-size:14px;font-weight:600;color:#FDFBF7;text-decoration:none;letter-spacing:0.3px;">
                      Sign in to Sok
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:12px;color:#6B5847;line-height:1.6;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;color:#6F4E37;word-break:break-all;background-color:#EFE6D8;padding:10px 12px;border-radius:2px;">
                ${url}
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:24px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#6B5847;line-height:1.6;">
                If you didn't request this email, you can safely ignore it.<br/>
                This link was requested for <strong>${email}</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
