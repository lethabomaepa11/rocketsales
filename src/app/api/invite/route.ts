import { NextRequest, NextResponse } from "next/server";

const BREVO_API_KEY = process.env.NEXT_PUBLIC_BREVO_API_KEY!;
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const SENDER_EMAIL = "lethabomaepa11@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, tenantId, role, inviterName, organizationName } = body;

    if (!email || !tenantId || !role) {
      return NextResponse.json(
        { error: "email, tenantId, and role are required" },
        { status: 400 }
      );
    }

    // Encode the invitation payload as a base64url token
    const invitePayload = JSON.stringify({ tenantId, role, email });
    const token = Buffer.from(invitePayload).toString("base64url");

    // Build the registration URL with the token
    const origin =
      request.headers.get("origin") ||
      request.headers.get("x-forwarded-host") ||
      "http://localhost:3000";
    const registerUrl = `${origin}/register?token=${token}`;

    // Send email via Brevo API
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "RocketSales",
          email: SENDER_EMAIL,
        },
        to: [
          {
            email: email,
          },
        ],
        subject: `You've been invited to join ${organizationName || "an organization"} on RocketSales`,
        htmlContent: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f5;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #DF6D27 0%, #c45a1c 100%);padding:24px 40px;text-align:center;">
              <img src="https://rocketsales-io.vercel.app/images/logo.png" alt="RocketSales" height="60" style="display:block;margin:0 auto;" />
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#1a1a1a;margin:0 0 16px;font-size:22px;">You're Invited!</h2>
              <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 8px;">
                ${inviterName ? `<strong>${inviterName}</strong> has invited you` : "You've been invited"} to join 
                <strong>${organizationName || "an organization"}</strong> on RocketSales as a <strong>${formatRole(role)}</strong>.
              </p>
              <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 32px;">
                Click the button below to create your account and get started.
              </p>
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${registerUrl}" 
                       style="display:inline-block;background:linear-gradient(135deg,#DF6D27 0%,#c45a1c 100%);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;letter-spacing:0.3px;">
                      Accept Invitation &amp; Register
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#999;font-size:13px;margin:32px 0 0;line-height:1.5;">
                If the button doesn't work, copy and paste this link into your browser:<br/>
                <a href="${registerUrl}" style="color:#DF6D27;word-break:break-all;">${registerUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
              <p style="color:#999;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} RocketSales. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Brevo API error:", errorData);
      return NextResponse.json(
        { error: "Failed to send invitation email", details: errorData.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Invitation sent to ${email}`,
    });
  } catch (error: unknown) {
    console.error("Failed to send invitation email:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: "Failed to send invitation email", details: err.message },
      { status: 500 }
    );
  }
}

function formatRole(role: string): string {
  const roleMap: Record<string, string> = {
    SalesRep: "Sales Representative",
    SalesManager: "Sales Manager",
    BusinessDevelopmentManager: "Business Development Manager",
    Admin: "Administrator",
  };
  return roleMap[role] || role;
}