import { NextRequest, NextResponse } from "next/server";
import { generatePDF, PDFDocumentData } from "@/utils/pdfGenerator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, subtitle, sections } = body as PDFDocumentData;

    if (!title || !sections) {
      return NextResponse.json(
        { error: "title and sections are required" },
        { status: 400 }
      );
    }

    const pdfData: PDFDocumentData = {
      title,
      subtitle,
      date: new Date().toLocaleDateString(),
      sections,
    };

    const pdfUri = generatePDF(pdfData);

    return NextResponse.json({
      success: true,
      pdf: pdfUri,
      message: "PDF generated successfully",
    });
  } catch (error) {
    console.error("PDF Generation API Error:", error);
    const err = error as { message?: string };
    return NextResponse.json(
      { error: "Failed to generate PDF", details: err.message },
      { status: 500 }
    );
  }
}
