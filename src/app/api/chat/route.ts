import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, tools, useAgenticWorkflow } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Prepare the system message for sales context
    const systemMessage = {
      role: "system",
      content: `You are an AI assistant for a sales management system called RocketSales. 
You help users with:
- Analyzing sales data and metrics
- Managing clients, contacts, and opportunities
- Creating and reviewing proposals and contracts
- Answering questions about the dashboard functionality
- Providing insights and recommendations

When in agentic mode, you can use available tools to perform actions on behalf of the user.
Always be helpful, professional, and concise in your responses.`,
    };

    // Prepare messages for the API
    const apiMessages = [systemMessage, ...messages];

    // Prepare tools if provided and agentic mode is enabled
    const toolDefinitions =
      useAgenticWorkflow && tools && tools.length > 0
        ? tools.map((tool: { name: string; description: string; parameters: unknown }) => ({
            type: "function",
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          }))
        : undefined;

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B for best performance
      temperature: 0.7,
      max_tokens: 4096,
      tools: toolDefinitions,
      tool_choice: useAgenticWorkflow ? "auto" : undefined,
    });

    const responseMessage = chatCompletion.choices[0]?.message;

    // Handle tool calls if present
    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCalls = responseMessage.tool_calls.map((toolCall) => ({
        id: toolCall.id,
        name: toolCall.function.name,
        arguments: JSON.parse(toolCall.function.arguments),
      }));

      return NextResponse.json({
        content: responseMessage.content || "",
        toolCalls,
      });
    }

    // Regular response
    return NextResponse.json({
      content: responseMessage?.content || "No response generated",
      toolCalls: [],
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
