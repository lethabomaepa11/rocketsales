"use client";

import { useState, useEffect } from "react";
import { Tabs, Card, Button, Space, message, Spin, Empty } from "antd";
import {
  PlusOutlined,
  CommentOutlined,
  FolderOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import EntityNotesList from "@/components/dashboards/notes/EntityNotesList";
import EntityDocumentsList from "@/components/dashboards/documents/EntityDocumentsList";
import ActivityForm from "@/components/dashboards/activities/ActivityForm";
import {
  useActivityState,
  useActivityActions,
} from "@/providers/activityProvider";
import {
  ActivityDto,
  ActivityType,
  ActivityStatus,
  RelatedToType as ActivityRelatedToType,
} from "@/providers/activityProvider/types";
import { RelatedToType as NoteRelatedToType } from "@/providers/noteProvider/types";
import { useAuthState } from "@/providers/authProvider";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { TabPane } = Tabs;

interface EntityDetailsTabsProps {
  relatedToType: NoteRelatedToType;
  relatedToId: string;
  relatedToTitle?: string;
}

const activityTypeLabels: Record<ActivityType, string> = {
  [ActivityType.Meeting]: "Meeting",
  [ActivityType.Call]: "Call",
  [ActivityType.Email]: "Email",
  [ActivityType.Task]: "Task",
  [ActivityType.Presentation]: "Presentation",
  [ActivityType.Other]: "Other",
};

const priorityColors: Record<number, string> = {
  1: "default", // Low
  2: "blue", // Medium
  3: "orange", // High
  4: "red", // Urgent
};

const statusColors: Record<ActivityStatus, string> = {
  [ActivityStatus.Scheduled]: "blue",
  [ActivityStatus.Completed]: "green",
  [ActivityStatus.Cancelled]: "red",
};

const EntityDetailsTabs: React.FC<EntityDetailsTabsProps> = ({
  relatedToType,
  relatedToId,
  relatedToTitle,
}) => {
  const [activeTab, setActiveTab] = useState("activities");
  const [isActivityFormVisible, setIsActivityFormVisible] = useState(false);

  const { activities, isPending: activitiesLoading } = useActivityState();
  const { fetchActivities, completeActivity, deleteActivity } =
    useActivityActions();
  const { user } = useAuthState();

  useEffect(() => {
    fetchActivities({
      relatedToType: relatedToType as unknown as ActivityRelatedToType,
      relatedToId,
    });
  }, [relatedToType, relatedToId]);

  const handleCompleteActivity = async (id: string) => {
    try {
      await completeActivity(id, "Completed");
      message.success("Activity completed");
      fetchActivities({
        relatedToType: relatedToType as unknown as ActivityRelatedToType,
        relatedToId,
      });
    } catch {
      message.error("Failed to complete activity");
    }
  };

  const handleDeleteActivity = async (id: string) => {
    try {
      await deleteActivity(id);
      message.success("Activity deleted");
      fetchActivities({
        relatedToType: relatedToType as unknown as ActivityRelatedToType,
        relatedToId,
      });
    } catch {
      message.error("Failed to delete activity");
    }
  };

  const activitiesList = Array.isArray(activities)
    ? activities
    : (activities as { items?: ActivityDto[] })?.items || [];

  const upcomingActivities = activitiesList
    .filter((a) => a.status === ActivityStatus.Scheduled)
    .sort((a, b) => {
      const dateA = a.dueDate ? dayjs(a.dueDate).valueOf() : Infinity;
      const dateB = b.dueDate ? dayjs(b.dueDate).valueOf() : Infinity;
      return dateA - dateB;
    });

  const completedActivities = activitiesList.filter(
    (a) => a.status === ActivityStatus.Completed,
  );

  const renderActivityCard = (activity: ActivityDto) => (
    <Card
      key={activity.id}
      size="small"
      className="activity-card"
      style={{ marginBottom: 12 }}
      extra={
        <Space>
          {activity.status === ActivityStatus.Scheduled && (
            <Button
              type="link"
              size="small"
              onClick={() => handleCompleteActivity(activity.id)}
            >
              Complete
            </Button>
          )}
          <Button
            type="link"
            size="small"
            danger
            onClick={() => handleDeleteActivity(activity.id)}
          >
            Delete
          </Button>
        </Space>
      }
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontWeight: 500 }}>
            {activityTypeLabels[activity.type] || "Activity"}:{" "}
            {activity.subject}
          </div>
          {activity.description && (
            <div style={{ color: "#666", fontSize: 12, marginTop: 4 }}>
              {activity.description.substring(0, 100)}
              {activity.description.length > 100 ? "..." : ""}
            </div>
          )}
        </div>
        <div style={{ textAlign: "right", minWidth: 100 }}>
          <div>
            <span
              style={{
                color:
                  activity.priority === 4
                    ? "#ff4d4f"
                    : activity.priority === 3
                      ? "#fa8c16"
                      : "#666",
                fontWeight: activity.priority >= 3 ? 500 : 400,
              }}
            >
              {activity.priorityName || "Priority"}
            </span>
          </div>
          {activity.dueDate && (
            <div
              style={{
                fontSize: 12,
                color: activity.isOverdue ? "#ff4d4f" : "#999",
              }}
            >
              {dayjs(activity.dueDate).format("MMM D, HH:mm")}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        defaultActiveKey="activities"
      >
        <TabPane
          tab={
            <span>
              <CalendarOutlined /> Activities
            </span>
          }
          key="activities"
        >
          <div style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsActivityFormVisible(true)}
            >
              Add Activity
            </Button>
          </div>

          {activitiesLoading ? (
            <div style={{ textAlign: "center", padding: 24 }}>
              <Spin />
            </div>
          ) : upcomingActivities.length === 0 &&
            completedActivities.length === 0 ? (
            <Empty description="No activities yet" />
          ) : (
            <>
              {upcomingActivities.length > 0 && (
                <div>
                  <h4 style={{ marginBottom: 12, color: "#666" }}>
                    Upcoming ({upcomingActivities.length})
                  </h4>
                  {upcomingActivities.map(renderActivityCard)}
                </div>
              )}

              {completedActivities.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ marginBottom: 12, color: "#666" }}>
                    Completed ({completedActivities.length})
                  </h4>
                  {completedActivities.slice(0, 5).map(renderActivityCard)}
                </div>
              )}
            </>
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <CommentOutlined /> Notes
            </span>
          }
          key="notes"
        >
          <EntityNotesList
            relatedToType={relatedToType}
            relatedToId={relatedToId}
          />
        </TabPane>

        <TabPane
          tab={
            <span>
              <FolderOutlined /> Documents
            </span>
          }
          key="documents"
        >
          <EntityDocumentsList
            relatedToType={relatedToType}
            relatedToId={relatedToId}
          />
        </TabPane>
      </Tabs>

      <ActivityForm
        visible={isActivityFormVisible}
        onCancel={() => setIsActivityFormVisible(false)}
        prefillRelatedToType={
          relatedToType as unknown as ActivityRelatedToType
        }
        prefillRelatedToId={relatedToId}
        prefillRelatedToTitle={relatedToTitle}
      />
    </div>
  );
};

export default EntityDetailsTabs;
