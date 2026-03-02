/**
 * Utility for creating stage-triggered activities
 * 
 * This module handles the automatic creation of activities when an opportunity
 * moves to a specific stage based on configured templates.
 */

import { OpportunityStage, OpportunityDto } from "@/providers/opportunityProvider/types";
import { RelatedToType, CreateActivityDto } from "@/providers/activityProvider/types";
import { getTemplateForStage, calculateDueDate } from "./stageTriggerTemplates";
import { getCurrentUser } from "./tenantUtils";

/**
 * Creates activities for a stage change based on configured templates
 * 
 * @param opportunity - The opportunity that changed stage
 * @param newStage - The new stage the opportunity moved to
 * @returns Array of activity data ready to be created, or empty array if no templates
 */
export const createStageTriggeredActivities = (
  opportunity: OpportunityDto,
  newStage: OpportunityStage,
): CreateActivityDto[] => {
  // Get the template for this stage
  const template = getTemplateForStage(newStage);
  
  if (!template || template.activities.length === 0) {
    return [];
  }

  const currentUser = getCurrentUser();
  const ownerId = currentUser?.userId || opportunity.ownerId;

  // Create activities from the template
  const activities: CreateActivityDto[] = template.activities.map((activityTemplate) => ({
    type: activityTemplate.type,
    subject: activityTemplate.subject,
    description: activityTemplate.description,
    relatedToType: RelatedToType.Opportunity,
    relatedToId: opportunity.id,
    assignedToId: ownerId,
    priority: activityTemplate.priority,
    dueDate: calculateDueDate(activityTemplate.dueInDays),
    duration: null,
    location: null,
  }));

  return activities;
};

/**
 * Check if stage triggers are enabled (can be used for feature flags)
 */
export const isStageTriggerEnabled = (): boolean => {
  return true; // Always enabled for now
};

/**
 * Get stages that have templates configured
 */
export const getTriggeredStages = (): OpportunityStage[] => {
  return [
    OpportunityStage.Qualified,
    OpportunityStage.Proposal,
    OpportunityStage.Negotiation,
  ];
};
