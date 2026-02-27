import { IAIState } from "./types";
import { AIAction } from "./actions";

export const AIReducer = (state: IAIState, action: AIAction): IAIState => {
  switch (action.type) {
    case "CREATE_SESSION":
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        currentSessionId: action.payload.id,
      };

    case "DELETE_SESSION": {
      const filteredSessions = state.sessions.filter(
        (s) => s.id !== action.payload,
      );
      return {
        ...state,
        sessions: filteredSessions,
        currentSessionId:
          state.currentSessionId === action.payload
            ? filteredSessions[0]?.id || null
            : state.currentSessionId,
      };
    }

    case "SWITCH_SESSION":
      return {
        ...state,
        currentSessionId: action.payload,
      };

    case "ADD_MESSAGE": {
      const { sessionId, message } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                messages: [...session.messages, message],
                updatedAt: new Date(),
              }
            : session,
        ),
      };
    }

    case "UPDATE_STREAMING_MESSAGE":
      return {
        ...state,
        streamingMessage: action.payload,
      };

    case "CLEAR_STREAMING_MESSAGE":
      return {
        ...state,
        streamingMessage: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };

    case "TOGGLE_CHAT":
      return {
        ...state,
        isChatOpen: !state.isChatOpen,
      };

    case "OPEN_CHAT":
      return {
        ...state,
        isChatOpen: true,
      };

    case "CLOSE_CHAT":
      return {
        ...state,
        isChatOpen: false,
      };

    case "UPDATE_SESSION_TITLE": {
      const { sessionId, title } = action.payload;
      return {
        ...state,
        sessions: state.sessions.map((session) =>
          session.id === sessionId ? { ...session, title } : session,
        ),
      };
    }

    case "SET_AGENTIC_MODE":
      // Agentic mode is handled at the component level
      return state;

    case "REGISTER_TOOL":
      // Tools are handled at the component level
      return state;

    case "UNREGISTER_TOOL":
      // Tools are handled at the component level
      return state;

    default:
      return state;
  }
};
