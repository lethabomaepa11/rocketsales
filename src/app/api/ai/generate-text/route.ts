import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, context, fieldType } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Build the system message based on the field type
    let systemMessage = `You are an AI assistant for a sales management system called RocketSales. 
Generate professional, concise text based on the user's request.`;

    // Add context-specific instructions
    if (fieldType) {
      switch (fieldType) {
        case "description":
          systemMessage += `\nGenerate a clear, professional description for a sales opportunity or item. Keep it concise but informative.`;
          break;
        case "terms":
          systemMessage += `\nGenerate professional contract terms. Be clear, concise, and use standard business language.`;
          break;
        case "notes":
          systemMessage += `\nGenerate a professional note. Keep it concise and clear.`;
          break;
        case "documentDescription":
          systemMessage += `\nGenerate a brief description for a document. Keep it short and descriptive.`;
          break;
        case "proposalContent":
          systemMessage += `\nGenerate professional proposal content. Be persuasive, clear, and professional.`;
          break;
        default:
          systemMessage += `\nGenerate clear, professional text.`;
      }
    }

    // Add business context if provided
    if (context) {
      systemMessage += `\n\nContext information:\n${context}`;
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system" as const,
          content: systemMessage,
        },
        {
          role: "user" as const,
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const generatedText = chatCompletion.choices[0]?.message?.content;

    if (!generatedText) {
      return NextResponse.json(
        { error: "No text generated" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      content: generatedText,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while generating text",
      },
      { status: 500 },
    );
  }
}
