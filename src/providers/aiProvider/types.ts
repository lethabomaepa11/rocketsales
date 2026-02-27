export interface IMessage {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  timestamp: Date;
  toolCalls?: IToolCall[];
  toolResults?: IToolResult[];
}

export interface IToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export interface IToolResult {
  toolCallId: string;
  result: unknown;
}

export interface IChatSession {
  id: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAIState {
  sessions: IChatSession[];
  currentSessionId: string | null;
  isChatOpen: boolean;
  isLoading: boolean;
  error: string | null;
  streamingMessage: string | null;
}

export interface IAgentTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  };
  execute: (args: Record<string, unknown>) => Promise<unknown>;
}

export interface ISendMessagePayload {
  content: string;
  sessionId?: string;
  useAgenticWorkflow?: boolean;
  tools?: IAgentTool[];
}

export interface ICreateSessionPayload {
  title?: string;
}

export interface IAIActionContext {
  sendMessage: (payload: ISendMessagePayload) => Promise<void>;
  createSession: (payload?: ICreateSessionPayload) => string;
  deleteSession: (sessionId: string) => void;
  switchSession: (sessionId: string) => void;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  clearError: () => void;
  setAgenticMode: (enabled: boolean) => void;
  registerTool: (tool: IAgentTool) => void;
  unregisterTool: (toolName: string) => void;
}
