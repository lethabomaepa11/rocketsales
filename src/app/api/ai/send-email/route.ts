import { NextRequest, NextResponse } from "next/server";
import { generateEmailLayout, sendBrevoEmail } from "@/utils/emailTemplates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, textContent } = body;
    let { htmlContent } = body;

    if (!to || !subject) {
      return NextResponse.json(
        { error: "to and subject are required" },
        { status: 400 }
      );
    }

    htmlContent = generateEmailLayout(htmlContent || `<p>${textContent || ""}</p>`, subject);
    // Send email using the shared helper function
    const result = await sendBrevoEmail({
      to,
      subject,
      htmlContent,
      textContent,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Email sent successfully to ${to}`,
    });
  } catch (error) {
    console.error("Email API Error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: "Failed to send email", details: err.message },
      { status: 500 }
    );
  }
}
