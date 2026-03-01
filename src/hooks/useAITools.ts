"use client";

import { useCallback } from "react";
import { IAgentTool } from "@/providers/aiProvider/types";
import { PDFDocumentData } from "@/utils/pdfGenerator";

export const useAITools = () => {
  const sendEmailTool: IAgentTool = {
    name: "sendEmail",
    description: "Send an email to a recipient. Use this when the user wants to send an email to a client, contact, or any other recipient.",
    parameters: {
      type: "object",
      properties: {
        to: {
          type: "string",
          description: "The email address of the recipient",
        },
        subject: {
          type: "string",
          description: "The subject line of the email",
        },
        htmlContent: {
          type: "string",
          description: "HTML content of the email (optional, use textContent if not provided)",
        },
        textContent: {
          type: "string",
          description: "Plain text content of the email",
        },
      },
      required: ["to", "subject", "textContent", "htmlContent"],
    },
    execute: useCallback(async (args: Record<string, unknown>) => {
      const { to, subject, htmlContent, textContent } = args;
      
      const response = await fetch("/api/ai/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, htmlContent, textContent }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to send email");
      }
      
      return data;
    }, []),
  };

  const generatePDFTool: IAgentTool = {
    name: "generatePDF",
    description: "Generate a PDF document with specified content. Use this when the user wants to create a PDF report, invoice, or document.",
    parameters: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the PDF document",
        },
        subtitle: {
          type: "string",
          description: "Optional subtitle for the document",
        },
        sections: {
          type: "array",
          description: "Array of sections to include in the PDF",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["title", "heading", "subheading", "paragraph", "list", "table", "separator"],
              },
              content: { type: "string" },
              items: { type: "array", items: { type: "string" } },
              headers: { type: "array", items: { type: "string" } },
              rows: { type: "array", items: { type: "array", items: { type: "string" } } },
            },
          },
        },
      },
      required: ["title", "sections"],
    },
    execute: useCallback(async (args: Record<string, unknown>) => {
      const { title, subtitle, sections } = args as { title: string; subtitle?: string; sections: PDFDocumentData["sections"] };
      
      const response = await fetch("/api/ai/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle, sections }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate PDF");
      }
      
      return data;
    }, []),
  };

  return {
    sendEmailTool,
    generatePDFTool,
  };
};
