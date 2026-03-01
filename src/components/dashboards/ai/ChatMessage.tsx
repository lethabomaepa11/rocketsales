"use client";

import React from "react";
import { RobotOutlined, UserOutlined, ToolOutlined } from "@ant-design/icons";
import { IMessage } from "@/providers/aiProvider/types";
import { useStyles } from "./style/AIChatbot.style";

interface ChatMessageProps {
  message: IMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { styles, cx } = useStyles();
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={cx(
        styles.messageWrapper,
        isUser ? styles.messageUser : styles.messageAssistant,
      )}
    >
      <div
        className={cx(
          styles.messageBubble,
          isUser ? styles.messageBubbleUser : styles.messageBubbleAssistant,
        )}
      >
        <div className={styles.messageHeader}>
          <div
            className={cx(
              styles.messageAvatar,
              isUser ? styles.messageAvatarUser : styles.messageAvatarAssistant,
            )}
          >
            {isUser ? <UserOutlined /> : <RobotOutlined />}
          </div>
          <span>{isUser ? "You" : "AI Assistant"}</span>
          <span className={styles.messageTime}>
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className={styles.messageContent}>{message.content}</div>
        {message.toolCalls && message.toolCalls.length > 0 && (
          <div className={styles.toolCallBadge}>
            <ToolOutlined />
            <span>Used {message.toolCalls.length} tool(s)</span>
          </div>
        )}
      </div>
    </div>
  );
};
