"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Switch, Tooltip, Modal } from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  MessageOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useAIState, useAIActions } from "@/providers/aiProvider";
import { useClientActions } from "@/providers/clientProvider";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ClientFormModal } from "@/components/common/ClientFormModal";
import { useCreateEntityPrompts } from "@/hooks/useCreateEntityPrompts";
import { useStyles } from "./style/AIChatbot.style";
import { IAgentTool } from "@/providers/aiProvider/types";
import { ClientDto } from "@/providers/clientProvider/types";
import {
  generatePDF,
  downloadPDF,
  PDFDocumentData,
} from "@/utils/pdfGenerator";

export const AIChatbot: React.FC = () => {
  const {
    sessions,
    currentSessionId,
    isChatOpen,
    isLoading,
    error,
    streamingMessage,
    isModalOpen,
    modalType,
    modalData,
  } = useAIState();
  const {
    sendMessage,
    createSession,
    deleteSession,
    toggleChat,
    closeChat,
    openChat,
    clearError,
    setAgenticMode,
    registerTool,
    openModal,
    closeModal,
    navigateTo,
  } = useAIActions();
  const { fetchClients } = useClientActions();
  const { promptAfterClientCreate } = useCreateEntityPrompts();
  const { styles, cx } = useStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAgentic, setIsAgentic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  // Register AI tools on mount
  useEffect(() => {
    const tools: IAgentTool[] = [
      {
        name: "createClient",
        description:
          "Create a new client in the system. Use this when the user wants to add a new client.",
        parameters: {
          type: "object",
          properties: {
            name: { type: "string", description: "Client name" },
            industry: { type: "string", description: "Industry" },
            companySize: { type: "string", description: "Company size" },
            website: { type: "string", description: "Website URL" },
            billingAddress: { type: "string", description: "Billing address" },
            taxNumber: { type: "string", description: "Tax number" },
            clientType: {
              type: "number",
              description: "Client type: 1=Prospect, 2=Customer, 3=Partner",
            },
          },
          required: ["name"],
        },
        execute: async (args: Record<string, unknown>) => {
          openModal("createClient", args);
          return {
            status: "pending",
            message: "Please fill in the client details in the form",
          };
        },
      },
      {
        name: "fetchClients",
        description: "Fetch list of clients from the system",
        parameters: {
          type: "object",
          properties: {
            searchTerm: { type: "string", description: "Search term" },
          },
        },
        execute: async (args: Record<string, unknown>) => {
          await fetchClients(args as { searchTerm?: string });
          return { status: "success", message: "Clients fetched successfully" };
        },
      },
      {
        name: "navigate",
        description: "Navigate to a specific page in the application",
        parameters: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description:
                "Path to navigate to. Examples: /dashboard, /clients, /opportunities, /contacts, /contracts, /proposals",
            },
          },
          required: ["path"],
        },
        execute: async (args: Record<string, unknown>) => {
          const path = args.path as string;
          navigateTo(path);
          return { status: "success", message: `Navigating to ${path}` };
        },
      },
      {
        name: "sendEmail",
        description:
          "Send an email to a recipient. Use this when the user wants to send an email to a client, contact, or any other recipient.",
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
              description: "HTML content of the email",
            },
            textContent: {
              type: "string",
              description: "Plain text content of the email",
            },
          },
          required: ["to", "subject"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { to, subject, htmlContent, textContent } = args;
          const response = await fetch("/api/ai/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to, subject, htmlContent, textContent }),
          });
          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error || "Failed to send email");
          return data;
        },
      },
      {
        name: "generatePDF",
        description:
          "Generate a PDF document with specified content. Use this when the user wants to create a PDF report, invoice, or document.",
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
                    enum: [
                      "title",
                      "heading",
                      "subheading",
                      "paragraph",
                      "list",
                      "table",
                      "separator",
                    ],
                  },
                  content: { type: "string" },
                  items: { type: "array", items: { type: "string" } },
                  headers: { type: "array", items: { type: "string" } },
                  rows: {
                    type: "array",
                    items: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
          required: ["title", "sections"],
        },
        execute: async (args: Record<string, unknown>) => {
          const { title, subtitle, sections } = args as {
            title: string;
            subtitle?: string;
            sections: PDFDocumentData["sections"];
          };

          // Generate PDF client-side
          const pdfData: PDFDocumentData = {
            title,
            subtitle,
            date: new Date().toLocaleDateString(),
            sections,
          };

          const pdfUri = generatePDF(pdfData);
          const fileName = `${title.replace(/[^a-z0-9]/gi, "_")}_${new Date().toISOString().split("T")[0]}`;
          downloadPDF(pdfUri, fileName);

          return {
            success: true,
            message: `PDF "${title}" has been downloaded to your device`,
          };
        },
      },
    ];

    tools.forEach((tool) => registerTool(tool));
  }, [registerTool, openModal, navigateTo, fetchClients]);

  // Handle modal success
  const handleModalSuccess = (createdClient: ClientDto) => {
    closeModal();
    // Ask user if they want to create a contact first, then opportunity
    promptAfterClientCreate(createdClient);
  };

  // Handle responsive layout
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Handle agentic mode toggle
  const handleAgenticToggle = (checked: boolean) => {
    setIsAgentic(checked);
    setAgenticMode(checked);
  };

  const handleSendMessage = async (content: string) => {
    if (!currentSessionId) {
      createSession({ title: content.slice(0, 30) + "..." });
    }
    await sendMessage({
      content,
      sessionId: currentSessionId || undefined,
      useAgenticWorkflow: isAgentic,
    });
  };

  const handleNewChat = () => {
    createSession({ title: "New Chat" });
  };

  // Empty state content
  const renderEmptyState = () => (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>
        <RobotOutlined />
      </div>
      <div className={styles.emptyStateTitle}>AI Assistant</div>
      <div className={styles.emptyStateDescription}>
        Ask me anything about your sales data, clients, opportunities, or how to
        use the dashboard. I can help you analyze data and perform actions.
      </div>
    </div>
  );

  // Loading indicator
  const renderLoadingIndicator = () => (
    <div className={styles.loadingIndicator}>
      <span>AI is thinking</span>
      <span className={styles.loadingDot} style={{ animationDelay: "0s" }} />
      <span className={styles.loadingDot} style={{ animationDelay: "0.2s" }} />
      <span className={styles.loadingDot} style={{ animationDelay: "0.4s" }} />
    </div>
  );

  return (
    <>
      {/* Chatbot Panel */}
      <div
        className={cx(
          styles.chatbotContainer,
          isChatOpen
            ? isMobile
              ? styles.chatbotMobile
              : styles.chatbotOpen
            : styles.chatbotClosed,
        )}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <RobotOutlined />
            <span>AI Assistant</span>
            {isAgentic && (
              <Tooltip title="Agentic Mode Active">
                <ThunderboltOutlined style={{ color: "#faad14" }} />
              </Tooltip>
            )}
          </div>
          <div className={styles.headerActions}>
            <Tooltip title="New Chat">
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleNewChat}
                className={styles.newChatButton}
              />
            </Tooltip>
            <Tooltip title="Close">
              <Button
                type="text"
                icon={<CloseOutlined />}
                onClick={closeChat}
                className={styles.closeButton}
              />
            </Tooltip>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {messages.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {streamingMessage && (
                <ChatMessage
                  message={{
                    id: "streaming",
                    role: "assistant",
                    content: streamingMessage,
                    timestamp: new Date(),
                  }}
                />
              )}
              {isLoading && !streamingMessage && renderLoadingIndicator()}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage} onClick={clearError}>
            {error}
          </div>
        )}

        {/* Agentic Mode Toggle */}
        <div className={styles.agenticModeToggle}>
          <ThunderboltOutlined
            style={{ color: isAgentic ? "#faad14" : undefined }}
          />
          <span className={styles.agenticModeLabel}>Agentic Mode</span>
          <Switch
            checked={isAgentic}
            onChange={handleAgenticToggle}
            size="small"
          />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          disabled={!currentSessionId && sessions.length === 0}
        />
      </div>

      {/* Toggle Button (visible when chat is closed) */}
      <Tooltip title="Open AI Assistant">
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined />}
          onClick={openChat}
          className={cx(
            styles.toggleButton,
            isChatOpen && styles.toggleButtonHidden,
          )}
          size="large"
        />
      </Tooltip>

      {/* Shared Client Form Modal */}
      <ClientFormModal
        visible={isModalOpen && modalType === "createClient"}
        initialData={modalData as Record<string, unknown>}
        onClose={closeModal}
        onSuccess={handleModalSuccess}
      />
    </>
  );
};
