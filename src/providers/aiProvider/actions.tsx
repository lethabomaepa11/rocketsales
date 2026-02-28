import { IMessage, IChatSession, IAgentTool } from "./types";

export const createSession = (session: IChatSession) => ({
  type: "CREATE_SESSION" as const,
  payload: session,
});

export const deleteSession = (sessionId: string) => ({
  type: "DELETE_SESSION" as const,
  payload: sessionId,
});

export const switchSession = (sessionId: string) => ({
  type: "SWITCH_SESSION" as const,
  payload: sessionId,
});

export const addMessage = (payload: {
  sessionId: string;
  message: IMessage;
}) => ({
  type: "ADD_MESSAGE" as const,
  payload,
});

export const updateStreamingMessage = (content: string) => ({
  type: "UPDATE_STREAMING_MESSAGE" as const,
  payload: content,
});

export const clearStreamingMessage = () => ({
  type: "CLEAR_STREAMING_MESSAGE" as const,
});

export const setLoading = (isLoading: boolean) => ({
  type: "SET_LOADING" as const,
  payload: isLoading,
});

export const setError = (error: string | null) => ({
  type: "SET_ERROR" as const,
  payload: error,
});

export const toggleChat = () => ({
  type: "TOGGLE_CHAT" as const,
});

export const openChat = () => ({
  type: "OPEN_CHAT" as const,
});

export const closeChat = () => ({
  type: "CLOSE_CHAT" as const,
});

export const updateSessionTitle = (payload: {
  sessionId: string;
  title: string;
}) => ({
  type: "UPDATE_SESSION_TITLE" as const,
  payload,
});

export const setAgenticMode = (enabled: boolean) => ({
  type: "SET_AGENTIC_MODE" as const,
  payload: enabled,
});

export const registerTool = (tool: IAgentTool) => ({
  type: "REGISTER_TOOL" as const,
  payload: tool,
});

export const unregisterTool = (toolName: string) => ({
  type: "UNREGISTER_TOOL" as const,
  payload: toolName,
});

export const openModal = (payload: {
  type: string;
  data?: Record<string, unknown>;
}) => ({
  type: "OPEN_MODAL" as const,
  payload,
});

export const closeModal = () => ({
  type: "CLOSE_MODAL" as const,
});

export const setPendingToolCall = (
  payload: {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
  } | null,
) => ({
  type: "SET_PENDING_TOOL_CALL" as const,
  payload,
});

export type AIAction =
  | ReturnType<typeof createSession>
  | ReturnType<typeof deleteSession>
  | ReturnType<typeof switchSession>
  | ReturnType<typeof addMessage>
  | ReturnType<typeof updateStreamingMessage>
  | ReturnType<typeof clearStreamingMessage>
  | ReturnType<typeof setLoading>
  | ReturnType<typeof setError>
  | ReturnType<typeof toggleChat>
  | ReturnType<typeof openChat>
  | ReturnType<typeof closeChat>
  | ReturnType<typeof updateSessionTitle>
  | ReturnType<typeof setAgenticMode>
  | ReturnType<typeof registerTool>
  | ReturnType<typeof unregisterTool>
  | ReturnType<typeof openModal>
  | ReturnType<typeof closeModal>
  | ReturnType<typeof setPendingToolCall>;
