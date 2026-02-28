"use client";

import { useContext, useReducer, useCallback, useRef, useState } from "react";
import { App } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  createSession as createSessionAction,
  deleteSession as deleteSessionAction,
  switchSession as switchSessionAction,
  addMessage,
  updateStreamingMessage,
  clearStreamingMessage,
  setLoading,
  setError,
  toggleChat as toggleChatAction,
  openChat as openChatAction,
  closeChat as closeChatAction,
  updateSessionTitle,
  openModal as openModalAction,
  closeModal as closeModalAction,
  setPendingToolCall as setPendingToolCallAction,
} from "./actions";
import { AIStateContext, AIActionContext, INITIAL_STATE } from "./context";
import { AIReducer } from "./reducer";
import {
  IMessage,
  IChatSession,
  ISendMessagePayload,
  ICreateSessionPayload,
  IAgentTool,
  ModalType,
} from "./types";

// Simple UUID generator if uuid package is not available
const generateId = () => {
  return typeof uuidv4 === "function"
    ? uuidv4()
    : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const AIProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(AIReducer, INITIAL_STATE);
  const { message } = App.useApp();
  const toolsRef = useRef<Map<string, IAgentTool>>(new Map());
  const [isAgenticMode, setIsAgenticMode] = useState(false);

  const createSession = useCallback((payload?: ICreateSessionPayload) => {
    const newSession: IChatSession = {
      id: generateId(),
      title: payload?.title || "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(createSessionAction(newSession));
    return newSession.id;
  }, []);

  const deleteSession = useCallback((sessionId: string) => {
    dispatch(deleteSessionAction(sessionId));
  }, []);

  const switchSession = useCallback((sessionId: string) => {
    dispatch(switchSessionAction(sessionId));
  }, []);

  const toggleChat = useCallback(() => {
    dispatch(toggleChatAction());
  }, []);

  const openChat = useCallback(() => {
    dispatch(openChatAction());
  }, []);

  const closeChat = useCallback(() => {
    dispatch(closeChatAction());
  }, []);

  const clearError = useCallback(() => {
    dispatch(setError(null));
  }, []);

  const setAgenticMode = useCallback((enabled: boolean) => {
    setIsAgenticMode(enabled);
  }, []);

  const registerTool = useCallback((tool: IAgentTool) => {
    toolsRef.current.set(tool.name, tool);
  }, []);

  const unregisterTool = useCallback((toolName: string) => {
    toolsRef.current.delete(toolName);
  }, []);

  const router = useRouter();

  const openModal = useCallback(
    (type: ModalType, data?: Record<string, unknown>) => {
      dispatch(openModalAction({ type: type || "confirmAction", data }));
    },
    [],
  );

  const closeModal = useCallback(() => {
    dispatch(closeModalAction());
    dispatch(setPendingToolCallAction(null));
  }, []);

  const setPendingToolCall = useCallback(
    (
      toolCall: {
        toolCallId: string;
        toolName: string;
        args: Record<string, unknown>;
      } | null,
    ) => {
      dispatch(setPendingToolCallAction(toolCall));
    },
    [],
  );

  const navigateTo = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  const executeTool = useCallback(
    async (toolName: string, args: Record<string, unknown>) => {
      const tool = toolsRef.current.get(toolName);
      if (!tool) {
        throw new Error(`Tool ${toolName} not found`);
      }
      return await tool.execute(args);
    },
    [],
  );

  const sendMessage = useCallback(
    async (payload: ISendMessagePayload) => {
      const {
        content,
        sessionId: providedSessionId,
        useAgenticWorkflow,
        tools: providedTools,
      } = payload;

      let sessionId = providedSessionId || state.currentSessionId;

      // Create a new session if none exists
      if (!sessionId) {
        sessionId = createSession({ title: content.slice(0, 30) + "..." });
      }

      // Add user message
      const userMessage: IMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      dispatch(addMessage({ sessionId, message: userMessage }));
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        // Get current session messages for context
        const session = state.sessions.find((s) => s.id === sessionId);
        const messageHistory = session?.messages || [];

        // Prepare tools for agentic workflow
        const availableTools =
          providedTools || Array.from(toolsRef.current.values());
        const toolsPayload =
          useAgenticWorkflow || isAgenticMode
            ? availableTools.map((t) => ({
                name: t.name,
                description: t.description,
                parameters: t.parameters,
              }))
            : [];

        // Call API
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              ...messageHistory.map((m) => ({
                role: m.role,
                content: m.content,
              })),
              { role: "user", content },
            ],
            tools: toolsPayload,
            useAgenticWorkflow: useAgenticWorkflow || isAgenticMode,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from AI");
        }

        const data = await response.json();

        // Handle tool calls if present
        if (data.toolCalls && data.toolCalls.length > 0) {
          const toolResults = await Promise.all(
            data.toolCalls.map(
              async (toolCall: {
                id: string;
                name: string;
                arguments: Record<string, unknown>;
              }) => {
                try {
                  const result = await executeTool(
                    toolCall.name,
                    toolCall.arguments,
                  );
                  return {
                    toolCallId: toolCall.id,
                    result,
                  };
                } catch (error) {
                  return {
                    toolCallId: toolCall.id,
                    result: { error: (error as Error).message },
                  };
                }
              },
            ),
          );

          // Send tool results back to AI
          const toolResponse = await fetch("/api/chat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: [
                ...messageHistory.map((m) => ({
                  role: m.role,
                  content: m.content,
                })),
                { role: "user", content },
                {
                  role: "assistant",
                  content: data.content,
                  toolCalls: data.toolCalls,
                },
                ...toolResults.map((tr) => ({
                  role: "tool",
                  content: JSON.stringify(tr.result),
                  toolCallId: tr.toolCallId,
                })),
              ],
              tools: toolsPayload,
              useAgenticWorkflow: true,
            }),
          });

          if (!toolResponse.ok) {
            throw new Error("Failed to get final response from AI");
          }

          const finalData = await toolResponse.json();

          const assistantMessage: IMessage = {
            id: generateId(),
            role: "assistant",
            content: finalData.content,
            timestamp: new Date(),
            toolCalls: data.toolCalls,
            toolResults,
          };

          dispatch(addMessage({ sessionId, message: assistantMessage }));
        } else {
          // Regular response without tool calls
          const assistantMessage: IMessage = {
            id: generateId(),
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          };

          dispatch(addMessage({ sessionId, message: assistantMessage }));
        }

        // Update session title if it's the first message
        if (session?.messages.length === 1) {
          dispatch(
            updateSessionTitle({
              sessionId,
              title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
            }),
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        dispatch(setError(errorMessage));
        message.error(errorMessage);
      } finally {
        dispatch(setLoading(false));
        dispatch(clearStreamingMessage());
      }
    },
    [
      state.sessions,
      state.currentSessionId,
      createSession,
      executeTool,
      isAgenticMode,
      message,
    ],
  );

  return (
    <AIStateContext.Provider value={state}>
      <AIActionContext.Provider
        value={{
          sendMessage,
          createSession,
          deleteSession,
          switchSession,
          toggleChat,
          openChat,
          closeChat,
          clearError,
          setAgenticMode,
          registerTool,
          unregisterTool,
          openModal,
          closeModal,
          setPendingToolCall,
          navigateTo,
        }}
      >
        {children}
      </AIActionContext.Provider>
    </AIStateContext.Provider>
  );
};

export const useAIState = () => {
  const context = useContext(AIStateContext);
  if (!context) {
    throw new Error("useAIState must be used within a AIProvider");
  }
  return context;
};

export const useAIActions = () => {
  const context = useContext(AIActionContext);
  if (!context) {
    throw new Error("useAIActions must be used within a AIProvider");
  }
  return context;
};
