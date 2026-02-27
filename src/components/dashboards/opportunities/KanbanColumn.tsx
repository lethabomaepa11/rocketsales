"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Badge, Typography } from "antd";
import {
  OpportunityDto,
  OpportunityStage,
} from "@/providers/opportunityProvider/types";
import { KanbanCard } from "./KanbanCard";
import { useStyles } from "./style/kanban.style";

const { Text } = Typography;

interface KanbanColumnProps {
  stage: OpportunityStage;
  stageName: string;
  stageColor: string;
  opportunities: OpportunityDto[];
  stageColors: Record<OpportunityStage, string>;
  onEditOpportunity: (opportunity: OpportunityDto) => void;
}

export const KanbanColumn = ({
  stage,
  stageName,
  stageColor,
  opportunities,
  stageColors,
  onEditOpportunity,
}: KanbanColumnProps) => {
  const { styles } = useStyles();

  const { setNodeRef, isOver } = useDroppable({
    id: stage.toString(),
    data: {
      type: "Column",
      stage,
    },
  });

  const totalValue = opportunities.reduce(
    (sum, opp) => sum + (opp.estimatedValue || 0),
    0,
  );

  const formatCurrency = (value: number) => {
    return `R ${value?.toLocaleString() || 0}`;
  };

  return (
    <div className={styles.kanbanColumn}>
      <div
        className={styles.columnHeader}
        style={{ borderTop: `3px solid ${stageColor}` }}
      >
        <div className={styles.columnTitle}>
          <Text strong>{stageName}</Text>
          <Badge
            count={opportunities.length}
            style={{ backgroundColor: stageColor }}
            className={styles.columnCount}
          />
        </div>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {formatCurrency(totalValue)}
        </Text>
      </div>

      <div
        ref={setNodeRef}
        className={`${styles.columnContent} ${styles.columnDroppable} ${
          isOver ? "isOver" : ""
        }`}
      >
        <SortableContext
          items={opportunities.map((o) => o.id)}
          strategy={verticalListSortingStrategy}
        >
          {opportunities.length === 0 ? (
            <div className={styles.emptyColumn}>Drop opportunities here</div>
          ) : (
            opportunities.map((opportunity) => (
              <KanbanCard
                key={opportunity.id}
                opportunity={opportunity}
                stageColors={stageColors}
                onEdit={onEditOpportunity}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};
