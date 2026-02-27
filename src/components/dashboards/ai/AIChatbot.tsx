"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button, Switch, Tooltip, Badge } from "antd";
import {
  CloseOutlined,
  PlusOutlined,
  MessageOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useAIState, useAIActions } from "@/providers/aiProvider";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useStyles } from "./style/AIChatbot.style";

export const AIChatbot: React.FC = () => {
  const {
    sessions,
    currentSessionId,
    isChatOpen,
    isLoading,
    error,
    streamingMessage,
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
  } = useAIActions();
  const { styles, cx } = useStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAgentic, setIsAgentic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

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
    </>
  );
};
