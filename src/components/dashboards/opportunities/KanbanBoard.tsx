"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { message, Spin } from "antd";
import {
  OpportunityDto,
  OpportunityStage,
} from "@/providers/opportunityProvider/types";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { useStyles } from "./style/kanban.style";

interface KanbanBoardProps {
  opportunities: OpportunityDto[];
  stageColors: Record<OpportunityStage, string>;
  stageLabels: Record<OpportunityStage, string>;
  onStageChange: (
    opportunityId: string,
    newStage: OpportunityStage,
    oldStage: OpportunityStage,
  ) => Promise<void>;
  onEditOpportunity: (opportunity: OpportunityDto) => void;
  canUpdateOpportunity: (opportunity: OpportunityDto) => boolean;
  loading?: boolean;
}

export const KanbanBoard = ({
  opportunities,
  stageColors,
  stageLabels,
  onStageChange,
  onEditOpportunity,
  canUpdateOpportunity,
  loading = false,
}: KanbanBoardProps) => {
  const { styles } = useStyles();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeOpportunity, setActiveOpportunity] =
    useState<OpportunityDto | null>(null);
  const [localOpportunities, setLocalOpportunities] =
    useState<OpportunityDto[]>(opportunities);

  // Sync local state with props
  useEffect(() => {
    setLocalOpportunities(opportunities);
  }, [opportunities]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const stages = useMemo((): OpportunityStage[] => {
    return Object.values(OpportunityStage).filter(
      (s): s is OpportunityStage => typeof s === "number",
    );
  }, []);

  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<OpportunityStage, OpportunityDto[]> = {
      [OpportunityStage.Lead]: [],
      [OpportunityStage.Qualified]: [],
      [OpportunityStage.Proposal]: [],
      [OpportunityStage.Negotiation]: [],
      [OpportunityStage.ClosedWon]: [],
      [OpportunityStage.ClosedLost]: [],
    };

    localOpportunities.forEach((opp) => {
      if (grouped[opp.stage]) {
        grouped[opp.stage].push(opp);
      }
    });

    return grouped;
  }, [localOpportunities]);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const { active } = event;
      const opportunity = localOpportunities.find((o) => o.id === active.id);

      if (opportunity && !canUpdateOpportunity(opportunity)) {
        message.warning("You can only move opportunities assigned to you.");
        return;
      }

      setActiveId(active.id as string);
      setActiveOpportunity(opportunity || null);
    },
    [localOpportunities, canUpdateOpportunity],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;

      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      // Find the containers
      const activeOpportunity = localOpportunities.find(
        (o) => o.id === activeId,
      );
      if (!activeOpportunity) return;

      const overStage = stages.find(
        (s: OpportunityStage) => s.toString() === overId,
      );

      // Dropping over a column
      if (overStage !== undefined && activeOpportunity.stage !== overStage) {
        setLocalOpportunities((prev) => {
          return prev.map((o) =>
            o.id === activeId ? { ...o, stage: overStage } : o,
          );
        });
      }
    },
    [localOpportunities, stages],
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);
      setActiveOpportunity(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find the opportunity - use opportunities (prop) for current data
      const activeOpportunity = opportunities.find((o) => o.id === activeId);
      if (!activeOpportunity) return;

      // Check permissions
      if (!canUpdateOpportunity(activeOpportunity)) {
        message.warning("You can only move opportunities assigned to you.");
        // Revert to original opportunities
        setLocalOpportunities(opportunities);
        return;
      }

      const overStage = stages.find(
        (s: OpportunityStage) => s.toString() === overId,
      );

      if (overStage !== undefined && activeOpportunity.stage !== overStage) {
        try {
          await onStageChange(activeId, overStage, activeOpportunity.stage);
          message.success(
            `Moved to ${stageLabels[overStage as OpportunityStage]}`,
          );
        } catch (error) {
          // Revert on error
          setLocalOpportunities(opportunities);
          message.error("Failed to update stage");
        }
      }
    },
    [opportunities, stages, stageLabels, onStageChange, canUpdateOpportunity],
  );

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 64 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.kanbanContainer}>
        {stages.map((stage: OpportunityStage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            stageName={stageLabels[stage]}
            stageColor={stageColors[stage]}
            opportunities={opportunitiesByStage[stage]}
            stageColors={stageColors}
            onEditOpportunity={onEditOpportunity}
          />
        ))}
      </div>

      <DragOverlay dropAnimation={dropAnimation}>
        {activeId && activeOpportunity ? (
          <KanbanCard
            opportunity={activeOpportunity}
            stageColors={stageColors}
            onEdit={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
