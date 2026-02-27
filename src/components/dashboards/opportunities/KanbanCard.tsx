"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, Progress, Tag, Tooltip } from "antd";
import {
  HolderOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  OpportunityDto,
  OpportunityStage,
} from "@/providers/opportunityProvider/types";
import { useStyles } from "./style/kanban.style";

interface KanbanCardProps {
  opportunity: OpportunityDto;
  stageColors: Record<OpportunityStage, string>;
  onEdit: (opportunity: OpportunityDto) => void;
}

export const KanbanCard = ({
  opportunity,
  stageColors,
  onEdit,
}: KanbanCardProps) => {
  const { styles } = useStyles();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: opportunity.id,
    data: {
      type: "Opportunity",
      opportunity,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatCurrency = (value: number, currency: string | null) => {
    return `${currency || "R"} ${value?.toLocaleString() || 0}`;
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.kanbanCard} ${isDragging ? styles.cardDragging : ""}`}
      onClick={() => onEdit(opportunity)}
    >
      <div className={styles.dragHandle}>
        <HolderOutlined />
      </div>

      <div className={styles.cardTitle}>
        {opportunity.title || "Untitled Opportunity"}
      </div>

      <div className={styles.cardMeta}>
        <div className={styles.cardMetaRow}>
          <DollarOutlined />
          <span className={styles.cardValue}>
            {formatCurrency(opportunity.estimatedValue, opportunity.currency)}
          </span>
        </div>

        <div className={styles.cardMetaRow}>
          <UserOutlined />
          <span>{opportunity.clientName || "No client"}</span>
        </div>

        <div className={styles.cardMetaRow}>
          <CalendarOutlined />
          <span>Close: {formatDate(opportunity.expectedCloseDate)}</span>
        </div>
      </div>

      <div className={styles.cardProbability}>
        <Progress
          percent={opportunity.probability}
          size="small"
          strokeColor={stageColors[opportunity.stage]}
          showInfo={true}
          format={(percent) => `${percent}%`}
        />
      </div>

      <div className={styles.cardFooter}>
        <Tooltip title={opportunity.ownerName || "Unassigned"}>
          <span className={styles.cardOwner}>
            <UserOutlined style={{ marginRight: 4 }} />
            {opportunity.ownerName || "Unassigned"}
          </span>
        </Tooltip>

        <Tag
          color={stageColors[opportunity.stage]}
          style={{ fontSize: 11, padding: "0 6px" }}
        >
          {opportunity.probability}%
        </Tag>
      </div>
    </div>
  );
};
