// route.ts - full file

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { getAxiosInstance } from "@/utils/axiosInstance";

const groq = new Groq({
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

async function getBusinessDataContext(): Promise<string> {
  const instance = getAxiosInstance();
  try {
    const [clientsRes, opportunitiesRes, contractsRes, proposalsRes, dashboardRes] =
      await Promise.allSettled([
        instance.get("/Clients", { params: { pageSize: 10 } }),
        instance.get("/Opportunities", { params: { pageSize: 10 } }),
        instance.get("/Contracts", { params: { pageSize: 10 } }),
        instance.get("/Proposals", { params: { pageSize: 10 } }),
        instance.get("/Dashboard/overview"),
      ]);

    const formatCurrency = (value: number) =>
      value ? `R ${value.toLocaleString("en-ZA")}` : "R 0";
    let context = "CURRENT BUSINESS DATA:\n\n";

    if (dashboardRes.status === "fulfilled") {
      const d = dashboardRes.value.data || {};
      context += `=== DASHBOARD ===\nRevenue: ${formatCurrency(d.revenue?.thisYear || 0)} | Win Rate: ${d.opportunities?.winRate || 0}% | Opps: ${d.opportunities?.totalCount || 0}\n\n`;
    }

    if (clientsRes.status === "fulfilled") {
      const clients = clientsRes.value.data?.items || [];
      context += `=== CLIENTS ===\n`;
      clients
        .slice(0, 5)
        .forEach((c: { name: string; email: string; status: string }) => {
          context += `- ${c.name || "Unnamed"} | ${c.email || "No email"} | ${c.status || "N/A"}\n`;
        });
      context += "\n";
    }

    if (opportunitiesRes.status === "fulfilled") {
      const opps = opportunitiesRes.value.data?.items || [];
      const stageNames = ["", "Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];
      context += `=== OPPORTUNITIES ===\n`;
      opps
        .slice(0, 5)
        .forEach(
          (o: {
            title: string;
            clientName: string;
            estimatedValue: number;
            stage: number;
          }) => {
            context += `- ${o.title || "Untitled"} | ${o.clientName || "Client"} | ${formatCurrency(o.estimatedValue || 0)} | ${stageNames[o.stage] || o.stage}\n`;
          },
        );
    }

    return context;
  } catch {
    return "Data unavailable";
  }
}

type RawMessage = {
  role: string;
  content?: string;
  toolCalls?: unknown[];
  tool_calls?: unknown[];
  toolCallId?: string;
  tool_call_id?: string;
  name?: string;
};

function sanitizeMessages(messages: RawMessage[]) {
  return messages
    .map((msg) => {
      // Tool result messages — Groq expects role: "tool" with tool_call_id
      if (msg.role === "tool") {
        return {
          role: "tool" as const,
          content: msg.content || "",
          tool_call_id: msg.tool_call_id || msg.toolCallId || "",
        };
      }

      // Assistant messages — strip toolCalls/tool_calls, only keep role + content
      if (msg.role === "assistant") {
        return {
          role: "assistant" as const,
          content: msg.content || "",
        };
      }

      // User messages — only keep role + content
      if (msg.role === "user") {
        return {
          role: "user" as const,
          content: msg.content || "",
        };
      }

      // System messages
      if (msg.role === "system") {
        return {
          role: "system" as const,
          content: msg.content || "",
        };
      }

      // Fallback — default to user role if unknown to satisfy types
      return {
        role: "user" as const,
        content: msg.content || "",
      };
    })
    .filter((msg) => {
      // Drop tool messages with no tool_call_id — Groq will reject them
      if (msg.role === "tool" && !(msg as { tool_call_id?: string }).tool_call_id) {
        return false;
      }
      return true;
    });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, tools, useAgenticWorkflow, includeContext } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 },
      );
    }

    let businessContext = "";
    if (includeContext) {
      businessContext = await getBusinessDataContext();
    }

    const systemMessage = {
      role: "system" as const,
      content: `You are an AI assistant for a sales management system called RocketSales.
You help users with:
- Analyzing sales data and metrics
- Managing clients, contacts, and opportunities
- Creating and reviewing proposals and contracts
- Answering questions about the dashboard functionality
- Providing insights and recommendations

When in agentic mode, you can use available tools to perform actions on behalf of the user.
Always be helpful, professional, and concise in your responses.

${businessContext ? `\n\n${businessContext}\n` : ""}`,
    };

    const sanitizedMessages = sanitizeMessages(messages as RawMessage[]);
    const apiMessages = [systemMessage, ...sanitizedMessages];

    const toolDefinitions =
      useAgenticWorkflow && tools && tools.length > 0
        ? tools.map(
            (tool: {
              name: string;
              description: string;
              parameters: unknown;
            }) => ({
              type: "function" as const,
              function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
              },
            }),
          )
        : undefined;

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
      tools: toolDefinitions,
      tool_choice: useAgenticWorkflow && toolDefinitions ? "auto" : undefined,
    });

    const responseMessage = chatCompletion.choices[0]?.message;

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

    return NextResponse.json({
      content: responseMessage?.content || "No response generated",
      toolCalls: [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while processing your request",
      },
      { status: 500 },
    );
  }
}