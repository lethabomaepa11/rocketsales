"use client";

import { IStageTemplateStateContext } from "./types";
import * as StageTemplateActions from "./actions";
import { StageTriggerTemplate } from "./types";

export const StageTemplateReducer = (
  state: IStageTemplateStateContext,
  action: { type: string; payload?: unknown },
): IStageTemplateStateContext => {
  switch (action.type) {
    case StageTemplateActions.LOAD_TEMPLATES_PENDING:
      return { ...state, isLoading: true };
    case StageTemplateActions.LOAD_TEMPLATES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        templates: action.payload as StageTriggerTemplate[],
      };
    case StageTemplateActions.LOAD_TEMPLATES_ERROR:
      return { ...state, isLoading: false };
    case StageTemplateActions.SAVE_TEMPLATES_PENDING:
      return { ...state, isSaving: true };
    case StageTemplateActions.SAVE_TEMPLATES_SUCCESS:
      return { ...state, isSaving: false, isDirty: false };
    case StageTemplateActions.SAVE_TEMPLATES_ERROR:
      return { ...state, isSaving: false };
    case StageTemplateActions.UPDATE_TEMPLATE:
      return {
        ...state,
        isDirty: true,
        templates: state.templates.map((t: StageTriggerTemplate) =>
          t.stage === (action.payload as StageTriggerTemplate).stage
            ? (action.payload as StageTriggerTemplate)
            : t,
        ),
      };
    case StageTemplateActions.SET_DIRTY:
      return { ...state, isDirty: action.payload as boolean };
    default:
      return state;
  }
};
