"use client";

import { createContext } from "react";
import { IStageTemplateStateContext } from "./types";
import { OpportunityStage } from "@/providers/opportunityProvider/types";
import { StageActivityTemplate, StageTriggerTemplate } from "./types";

export const INITIAL_STATE: IStageTemplateStateContext = {
  templates: [],
  isLoading: false,
  isSaving: false,
  isDirty: false,
};

export const StageTemplateStateContext =
  createContext<IStageTemplateStateContext>(INITIAL_STATE);

export interface StageTemplateActionContextType {
  loadTemplates: () => void;
  saveTemplates: (templates: StageTriggerTemplate[]) => Promise<void>;
  updateTemplate: (template: StageTriggerTemplate) => void;
  addActivity: (
    stage: OpportunityStage,
    activity: StageActivityTemplate,
  ) => void;
  removeActivity: (stage: OpportunityStage, activityId: string) => void;
  resetToDefaults: () => void;
}

export const StageTemplateActionContext =
  createContext<StageTemplateActionContextType | null>(null);
