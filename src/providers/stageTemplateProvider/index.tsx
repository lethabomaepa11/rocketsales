"use client";

import { useContext, useReducer, useCallback, useEffect } from "react";
import { App } from "antd";
import {
  StageTemplateStateContext,
  StageTemplateActionContext,
  INITIAL_STATE,
} from "./context";
import { StageTemplateReducer } from "./reducer";
import * as StageTemplateActions from "./actions";
import { StageTriggerTemplate, StageActivityTemplate } from "./types";
import { OpportunityStage } from "@/providers/opportunityProvider/types";
import {
  DEFAULT_STAGE_TEMPLATES,
  saveCustomTemplates,
  loadCustomTemplates,
} from "@/utils/stageTriggerTemplates";

export const StageTemplateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(StageTemplateReducer, INITIAL_STATE);
  const { notification } = App.useApp();

  // Load templates on mount
  const loadTemplates = useCallback(() => {
    dispatch(StageTemplateActions.loadTemplatesPending());
    try {
      const customTemplates = loadCustomTemplates();
      const templates = customTemplates || DEFAULT_STAGE_TEMPLATES;
      dispatch(StageTemplateActions.loadTemplatesSuccess(templates));
    } catch {
      dispatch(StageTemplateActions.loadTemplatesError());
    }
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Save templates to local storage
  const saveTemplates = useCallback(
    async (templates: StageTriggerTemplate[]) => {
      dispatch(StageTemplateActions.saveTemplatesPending());
      try {
        saveCustomTemplates(templates);
        dispatch(StageTemplateActions.saveTemplatesSuccess());
        notification.success({
          title: "Success",
          description: "Stage trigger templates saved",
        });
      } catch {
        dispatch(StageTemplateActions.saveTemplatesError());
        notification.error({
          title: "Error",
          description: "Failed to save templates",
        });
      }
    },
    [notification],
  );

  // Update a single template
  const updateTemplate = useCallback((template: StageTriggerTemplate) => {
    dispatch(StageTemplateActions.updateTemplate(template));
  }, []);

  // Add activity to a stage template
  const addActivity = useCallback(
    (stage: OpportunityStage, activity: StageActivityTemplate) => {
      const template = state.templates.find((t) => t.stage === stage);
      if (template) {
        const updatedTemplate = {
          ...template,
          activities: [...template.activities, activity],
        };
        dispatch(StageTemplateActions.updateTemplate(updatedTemplate));
      }
    },
    [state.templates],
  );

  // Remove activity from a stage template
  const removeActivity = useCallback(
    (stage: OpportunityStage, activityId: string) => {
      const template = state.templates.find((t) => t.stage === stage);
      if (template) {
        const updatedTemplate = {
          ...template,
          activities: template.activities.filter((a) => a.id !== activityId),
        };
        dispatch(StageTemplateActions.updateTemplate(updatedTemplate));
      }
    },
    [state.templates],
  );

  // Reset to default templates
  const resetToDefaults = useCallback(() => {
    dispatch(
      StageTemplateActions.loadTemplatesSuccess(DEFAULT_STAGE_TEMPLATES),
    );
    dispatch(StageTemplateActions.setDirty(true));
  }, []);

  return (
    <StageTemplateStateContext.Provider value={state}>
      <StageTemplateActionContext.Provider
        value={{
          loadTemplates,
          saveTemplates,
          updateTemplate,
          addActivity,
          removeActivity,
          resetToDefaults,
        }}
      >
        {children}
      </StageTemplateActionContext.Provider>
    </StageTemplateStateContext.Provider>
  );
};

export const useStageTemplateState = () => {
  const context = useContext(StageTemplateStateContext);
  if (!context)
    throw new Error(
      "useStageTemplateState must be used within StageTemplateProvider",
    );
  return context;
};

export const useStageTemplateActions = () => {
  const context = useContext(StageTemplateActionContext);
  if (!context)
    throw new Error(
      "useStageTemplateActions must be used within StageTemplateProvider",
    );
  return context;
};
