"use client";

import { KanbanBoard } from "./KanbanBoard";
import {
  OpportunityDto,
  OpportunityStage,
} from "@/providers/opportunityProvider/types";

interface KanbanPipelineProps {
  opportunities: OpportunityDto[];
  stageColors: Record<OpportunityStage, string>;
  stageLabels: Record<OpportunityStage, string>;
  onStageChange: (id: string, stage: OpportunityStage) => Promise<void>;
  onEditOpportunity: (opportunity: OpportunityDto) => void;
  canUpdateOpportunity: (opportunity: OpportunityDto) => boolean;
  loading?: boolean;
}

export const KanbanPipeline = ({
  opportunities,
  stageColors,
  stageLabels,
  onStageChange,
  onEditOpportunity,
  canUpdateOpportunity,
  loading,
}: KanbanPipelineProps) => {
  const handleStageChange = async (
    opportunityId: string,
    newStage: OpportunityStage,
    oldStage: OpportunityStage,
  ) => {
    // Only call API if stage actually changed
    if (newStage !== oldStage) {
      await onStageChange(opportunityId, newStage);
    }
  };

  return (
    <KanbanBoard
      opportunities={opportunities}
      stageColors={stageColors}
      stageLabels={stageLabels}
      onStageChange={handleStageChange}
      onEditOpportunity={onEditOpportunity}
      canUpdateOpportunity={canUpdateOpportunity}
      loading={loading}
    />
  );
};
