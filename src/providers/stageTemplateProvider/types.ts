
/**
 * Stage Template Provider Types
 */

import { OpportunityStage } from "@/providers/opportunityProvider/types";
import { ActivityType, Priority } from "@/providers/activityProvider/types";

/**
 * Activity template for auto-creation
 */
export interface StageActivityTemplate {
  id: string;
  subject: string;
  description: string | null;
  type: ActivityType;
  priority: Priority;
  dueInDays: number; // Number of days from the stage change date (0 = today)
}

/**
 * Stage trigger template - defines activities to create when moving to a stage
 */
export interface StageTriggerTemplate {
  stage: OpportunityStage;
  stageName: string;
  activities: StageActivityTemplate[];
}

/**
 * State for stage templates
 */
export interface IStageTemplateStateContext {
  templates: StageTriggerTemplate[];
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
}
