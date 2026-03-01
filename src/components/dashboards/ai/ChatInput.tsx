"use client";

import React, { useState } from "react";
import { Button, Input } from "antd";
import { SendOutlined, LoadingOutlined } from "@ant-design/icons";
import { useStyles } from "./style/AIChatbot.style";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  disabled = false,
}) => {
  const [input, setInput] = useState("");
  const { styles } = useStyles();

  const handleSend = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.inputContainer}>
      <div className={styles.inputWrapper}>
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          className={styles.textArea}
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={isLoading || disabled}
        />
        <Button
          type="primary"
          icon={isLoading ? <LoadingOutlined /> : <SendOutlined />}
          onClick={handleSend}
          disabled={!input.trim() || isLoading || disabled}
          className={styles.sendButton}
        />
      </div>
    </div>
  );
};
