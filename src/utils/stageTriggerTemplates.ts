/**
 * Stage-Triggered Task Templates Configuration
 * 
 * This module defines the configuration for automatically creating activities
 * when an opportunity moves to a specific stage.
 */

import { OpportunityStage } from "@/providers/opportunityProvider/types";
import { ActivityType, Priority, RelatedToType } from "@/providers/activityProvider/types";

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
 * Get the default templates for each stage
 * These are the default templates that can be customized by managers
 */
export const DEFAULT_STAGE_TEMPLATES: StageTriggerTemplate[] = [
  {
    stage: OpportunityStage.Qualified,
    stageName: "Qualified",
    activities: [
      {
        id: "qualified-1",
        subject: "Send intro email",
        description: "Send introduction email to the client",
        type: ActivityType.Email,
        priority: Priority.High,
        dueInDays: 0,
      },
      {
        id: "qualified-2",
        subject: "Schedule discovery call",
        description: "Schedule a discovery call with the client",
        type: ActivityType.Call,
        priority: Priority.Medium,
        dueInDays: 2,
      },
    ],
  },
  {
    stage: OpportunityStage.Proposal,
    stageName: "Proposal",
    activities: [
      {
        id: "proposal-1",
        subject: "Send intro email",
        description: "Send introduction email with proposal overview",
        type: ActivityType.Email,
        priority: Priority.High,
        dueInDays: 0,
      },
      {
        id: "proposal-2",
        subject: "Schedule demo",
        description: "Schedule a demo presentation for the client",
        type: ActivityType.Meeting,
        priority: Priority.High,
        dueInDays: 3,
      },
      {
        id: "proposal-3",
        subject: "Follow up on pricing",
        description: "Follow up on pricing discussion",
        type: ActivityType.Call,
        priority: Priority.Medium,
        dueInDays: 7,
      },
    ],
  },
  {
    stage: OpportunityStage.Negotiation,
    stageName: "Negotiation",
    activities: [
      {
        id: "negotiation-1",
        subject: "Send contract",
        description: "Send contract for review",
        type: ActivityType.Email,
        priority: Priority.Urgent,
        dueInDays: 0,
      },
      {
        id: "negotiation-2",
        subject: "Schedule contract review call",
        description: "Schedule a call to discuss contract terms",
        type: ActivityType.Call,
        priority: Priority.High,
        dueInDays: 2,
      },
    ],
  },
];

/**
 * Storage key for custom templates
 */
const STORAGE_KEY = "stage-trigger-templates";

/**
 * Load templates from local storage (user customizations)
 */
export const loadCustomTemplates = (): StageTriggerTemplate[] | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as StageTriggerTemplate[];
  } catch {
    return null;
  }
};

/**
 * Save custom templates to local storage
 */
export const saveCustomTemplates = (templates: StageTriggerTemplate[]): void => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  } catch (error) {
  }
};

/**
 * Get all active templates (custom or default)
 */
export const getActiveTemplates = (): StageTriggerTemplate[] => {
  return loadCustomTemplates() || DEFAULT_STAGE_TEMPLATES;
};

/**
 * Get template for a specific stage
 */
export const getTemplateForStage = (stage: OpportunityStage): StageTriggerTemplate | undefined => {
  const templates = getActiveTemplates();
  return templates.find((t) => t.stage === stage);
};

/**
 * Calculate due date based on days from today
 */
export const calculateDueDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

/**
 * Activity type options for UI
 */
export const ACTIVITY_TYPE_OPTIONS = [
  { value: ActivityType.Email, label: "Email" },
  { value: ActivityType.Call, label: "Call" },
  { value: ActivityType.Meeting, label: "Meeting" },
  { value: ActivityType.Task, label: "Task" },
  { value: ActivityType.Presentation, label: "Presentation" },
  { value: ActivityType.Other, label: "Other" },
];

/**
 * Priority options for UI
 */
export const PRIORITY_OPTIONS = [
  { value: Priority.Low, label: "Low" },
  { value: Priority.Medium, label: "Medium" },
  { value: Priority.High, label: "High" },
  { value: Priority.Urgent, label: "Urgent" },
];

/**
 * Stage labels for display
 */
export const STAGE_LABELS: Record<OpportunityStage, string> = {
  [OpportunityStage.Lead]: "Lead",
  [OpportunityStage.Qualified]: "Qualified",
  [OpportunityStage.Proposal]: "Proposal",
  [OpportunityStage.Negotiation]: "Negotiation",
  [OpportunityStage.ClosedWon]: "Closed Won",
  [OpportunityStage.ClosedLost]: "Closed Lost",
};
