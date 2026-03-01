"use client";

import { Button, Tooltip, Modal, Input, Form, message, App } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAITextGeneration } from "@/hooks/useAITextGeneration";

const { TextArea } = Input;

interface AIGenerateButtonProps {
  onGenerate: (generatedText: string) => void;
  fieldType?:
    | "description"
    | "terms"
    | "notes"
    | "documentDescription"
    | "proposalContent"
    | "general";
  context?: string;
  disabled?: boolean;
}

export const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({
  onGenerate,
  fieldType = "general",
  context,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { generateText, isGenerating } = useAITextGeneration();
  const { message: appMessage } = App.useApp();

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleGenerate = async () => {
    try {
      const values = await form.validateFields();
      const prompt = values.prompt;

      const generatedText = await generateText({
        prompt,
        context,
        fieldType,
      });

      if (generatedText) {
        onGenerate(generatedText);
        handleClose();
        appMessage.success("Text generated successfully!");
      }
    } catch (error) {
      // Validation error or generation error handled in hook
    }
  };

  return (
    <>
      <Tooltip title="Generate with AI">
        <Button
          type="text"
          size="small"
          icon={<RobotOutlined />}
          onClick={handleOpen}
          disabled={disabled}
          className="ai-generate-btn"
        />
      </Tooltip>

      <Modal
        title={
          <span>
            <RobotOutlined style={{ marginRight: 8 }} />
            Generate with AI
          </span>
        }
        open={isModalOpen}
        onOk={handleGenerate}
        onCancel={handleClose}
        okText="Generate"
        confirmLoading={isGenerating}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="prompt"
            label="What would you like to generate?"
            rules={[
              { required: true, message: "Please enter a prompt" },
              { min: 5, message: "Prompt should be at least 5 characters" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={
                fieldType === "description"
                  ? "e.g., Describe a software development project for a mid-sized company..."
                  : fieldType === "terms"
                    ? "e.g., Generate standard payment terms and conditions..."
                    : fieldType === "notes"
                      ? "e.g., Write a follow-up note about the client meeting..."
                      : fieldType === "documentDescription"
                        ? "e.g., Describe this quarterly report document..."
                        : "Describe what you want to generate..."
              }
            />
          </Form.Item>
          {context && (
            <div style={{ marginBottom: 16, color: "#888", fontSize: 12 }}>
              <strong>Context:</strong> {context}
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};
