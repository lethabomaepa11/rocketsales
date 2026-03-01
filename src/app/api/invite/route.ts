import { NextRequest, NextResponse } from "next/server";
import { sendBrevoEmail, generateEmailLayout } from "@/utils/emailTemplates";

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

    // Generate the invite email body content using the shared layout
    const bodyContent = `
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
      </p>`;

    // Generate the full email with shared layout
    const htmlContent = generateEmailLayout(bodyContent, "You're Invited!");

    // Send email using the shared helper function
    const result = await sendBrevoEmail({
      to: email,
      subject: `You've been invited to join ${organizationName || "an organization"} on RocketSales`,
      htmlContent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send invitation email", details: result.error },
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
