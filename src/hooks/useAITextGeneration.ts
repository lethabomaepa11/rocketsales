"use client";

import { useState, useCallback } from "react";
import { App } from "antd";

interface GenerateTextOptions {
  prompt: string;
  context?: string;
  fieldType?: "description" | "terms" | "notes" | "documentDescription" | "proposalContent" | "general";
}

interface UseAITextGenerationReturn {
  generateText: (options: GenerateTextOptions) => Promise<string | null>;
  isGenerating: boolean;
}

export const useAITextGeneration = (): UseAITextGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { message } = App.useApp();

  const generateText = useCallback(
    async (options: GenerateTextOptions): Promise<string | null> => {
      const { prompt, context, fieldType } = options;

      if (!prompt.trim()) {
        message.error("Please provide a prompt for text generation");
        return null;
      }

      setIsGenerating(true);

      try {
        const response = await fetch("/api/ai/generate-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt,
            context,
            fieldType,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to generate text");
        }

        return data.content || null;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        message.error(errorMessage);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [message],
  );

  return {
    generateText,
    isGenerating,
  };
};
