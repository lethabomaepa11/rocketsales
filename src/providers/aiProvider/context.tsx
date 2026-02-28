"use client";

import { createContext } from "react";
import { IAIState, IAIActionContext } from "./types";

export const INITIAL_STATE: IAIState = {
  sessions: [],
  currentSessionId: null,
  isChatOpen: true,
  isLoading: false,
  error: null,
  streamingMessage: null,
  isModalOpen: false,
  modalType: null,
  modalData: null,
  pendingToolCall: null,
};

export const AIStateContext = createContext<IAIState | undefined>(undefined);
export const AIActionContext = createContext<IAIActionContext | undefined>(
  undefined,
);
