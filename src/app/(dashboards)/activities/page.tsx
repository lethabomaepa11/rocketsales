"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Typography,
  Popconfirm,
  Tabs,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
  CheckOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  useActivityState,
  useActivityActions,
} from "@/providers/activityProvider";
import { useAuthState } from "@/providers/authProvider";
import {
  ActivityDto,
  CreateActivityDto,
  UpdateActivityDto,
  ActivityStatus,
  ActivityType,
  Priority,
  RelatedToType,
  ActivityParticipantDto,
} from "@/providers/activityProvider/types";
import UserSelector from "@/components/common/UserSelector";
import RelatedEntitySelector from "@/components/common/RelatedEntitySelector";
import dayjs from "dayjs";
import { useStyles } from "./style/page.style";

const { Title, Text } = Typography;

const statusColors: Record<ActivityStatus, string> = {
  [ActivityStatus.Scheduled]: "processing",
  [ActivityStatus.Completed]: "success",
  [ActivityStatus.Cancelled]: "default",
};
const statusLabels: Record<ActivityStatus, string> = {
  [ActivityStatus.Scheduled]: "Scheduled",
  [ActivityStatus.Completed]: "Completed",
  [ActivityStatus.Cancelled]: "Cancelled",
};
const typeLabels: Record<ActivityType, string> = {
  [ActivityType.Meeting]: "Meeting",
  [ActivityType.Call]: "Call",
  [ActivityType.Email]: "Email",
  [ActivityType.Task]: "Task",
  [ActivityType.Presentation]: "Presentation",
  [ActivityType.Other]: "Other",
};
const priorityLabels: Record<Priority, string> = {
  [Priority.Low]: "Low",
  [Priority.Medium]: "Medium",
  [Priority.High]: "High",
  [Priority.Urgent]: "Urgent",
};
const priorityColors: Record<Priority, string> = {
  [Priority.Low]: "green",
  [Priority.Medium]: "blue",
  [Priority.High]: "orange",
  [Priority.Urgent]: "red",
};
const relatedToLabels: Record<RelatedToType, string> = {
  [RelatedToType.Client]: "Client",
  [RelatedToType.Opportunity]: "Opportunity",
  [RelatedToType.Proposal]: "Proposal",
  [RelatedToType.Contract]: "Contract",
  [RelatedToType.PricingRequest]: "Pricing Request",
};

const ActivitiesPage = () => {
  const { styles } = useStyles();
  const { activities, participants, isPending } = useActivityState();
  const {
    fetchActivities,
    fetchMyActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    completeActivity,
    cancelActivity,
    fetchParticipants,
    addParticipant,
  } = useActivityActions();
  const { user } = useAuthState();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isParticipantModalVisible, setIsParticipantModalVisible] =
    useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityDto | null>(
    null,
  );
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();
  const [participantForm] = Form.useForm();
  const relatedToType = Form.useWatch("relatedToType", form);

  const isSalesRepUser = user?.roles?.includes("SalesRep") ?? false;
  const currentUserId = user?.userId;

  // Guard against non-array state
  const activitiesList = Array.isArray(activities)
    ? activities
    : ((activities as { items?: ActivityDto[] })?.items ?? []);

  const participantsList = Array.isArray(participants)
    ? participants
    : ((participants as { items?: ActivityParticipantDto[] })?.items ?? []);

  const filteredActivities =
    activeTab === "all"
      ? activitiesList
      : activitiesList.filter(
          (a: ActivityDto) => String(a.status) === activeTab,
        );

  useEffect(() => {
    if (isSalesRepUser) {
      fetchMyActivities();
    } else {
      fetchActivities();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshActivities = () => {
    if (isSalesRepUser) {
      fetchMyActivities();
    } else {
      fetchActivities();
    }
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    form.resetFields();
    if (isSalesRepUser) {
      form.setFieldsValue({ assignedToId: currentUserId });
    }
    setIsModalVisible(true);
  };

  const handleEditActivity = (activity: ActivityDto) => {
    setEditingActivity(activity);
    form.setFieldsValue({
      ...activity,
      dueDate: activity.dueDate ? dayjs(activity.dueDate) : null,
    });
    setIsModalVisible(true);
  };

  const handleDeleteActivity = async (id: string) => {
    await deleteActivity(id);
    refreshActivities();
  };

  const handleCompleteActivity = async (id: string) => {
    await completeActivity(id);
    refreshActivities();
  };

  const handleCancelActivity = async (id: string) => {
    await cancelActivity(id);
    refreshActivities();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        assignedToId: isSalesRepUser
          ? (currentUserId ?? values.assignedToId)
          : values.assignedToId,
        dueDate: values.dueDate?.toISOString(),
      };
      if (editingActivity) {
        await updateActivity(editingActivity.id, data as UpdateActivityDto);
      } else {
        await createActivity(data as CreateActivityDto);
      }
      setIsModalVisible(false);
      refreshActivities();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleViewParticipants = (activityId: string) => {
    setSelectedActivityId(activityId);
    fetchParticipants(activityId);
    setIsParticipantModalVisible(true);
  };

  const handleAddParticipant = async () => {
    if (!selectedActivityId) return;
    try {
      const values = await participantForm.validateFields();
      await addParticipant(selectedActivityId, values);
      participantForm.resetFields();
      fetchParticipants(selectedActivityId);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string, record: ActivityDto) => (
        <Space>
          {text || "N/A"}
          {record.isOverdue && record.status !== ActivityStatus.Completed && (
            <Tooltip title="Overdue">
              <Badge status="error" />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: ActivityType) => typeLabels[type] || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ActivityStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Priority) => (
        <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string, record: ActivityDto) =>
        date ? (
          <span
            className={record.isOverdue ? styles.overdueDateText : undefined}
          >
            {dayjs(date).format("YYYY-MM-DD")}
          </span>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number | null) =>
        duration ? `${duration} min` : "N/A",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      render: (text: string) => text || "Unassigned",
    },
    {
      title: "Related To",
      dataIndex: "relatedToTitle",
      key: "relatedToTitle",
      render: (text: string, record: ActivityDto) =>
        text ? (
          <Space direction="vertical" size={0}>
            <span>{text}</span>
            <Text type="secondary" className={styles.relatedMetaText}>
              {relatedToLabels[record.relatedToType]}
            </Text>
          </Space>
        ) : (
          "N/A"
        ),
    },
    {
      title: "Participants",
      dataIndex: "participantsCount",
      key: "participantsCount",
      render: (count: number, record: ActivityDto) => (
        <Tooltip title="View participants">
          <Button
            type="text"
            icon={<TeamOutlined />}
            onClick={() => handleViewParticipants(record.id)}
          >
            {count || 0}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ActivityDto) => (
        <Space>
          {!isSalesRepUser && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditActivity(record)}
              />
            </Tooltip>
          )}
          {!isSalesRepUser && record.status === ActivityStatus.Scheduled && (
            <Tooltip title="Mark complete">
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleCompleteActivity(record.id)}
              />
            </Tooltip>
          )}
          {!isSalesRepUser && record.status === ActivityStatus.Scheduled && (
            <Tooltip title="Cancel">
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleCancelActivity(record.id)}
              />
            </Tooltip>
          )}
          {!isSalesRepUser && (
            <Popconfirm
              title="Delete this activity?"
              onConfirm={() => handleDeleteActivity(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button type="link" danger icon={<DeleteOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: "All Activities" },
    { key: String(ActivityStatus.Scheduled), label: "Scheduled" },
    { key: String(ActivityStatus.Completed), label: "Completed" },
    { key: String(ActivityStatus.Cancelled), label: "Cancelled" },
  ];

  return (
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
          <Title level={3}>Activities</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddActivity}
          >
            Add Activity
          </Button>
        </div>

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <Table
          columns={columns}
          dataSource={filteredActivities}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />

        {/* Add / Edit Activity Modal */}
        <Modal
          title={editingActivity ? "Edit Activity" : "Add Activity"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="subject"
              label="Subject"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: ActivityType.Meeting, label: "Meeting" },
                  { value: ActivityType.Call, label: "Call" },
                  { value: ActivityType.Email, label: "Email" },
                  { value: ActivityType.Task, label: "Task" },
                  { value: ActivityType.Presentation, label: "Presentation" },
                  { value: ActivityType.Other, label: "Other" },
                ]}
              />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="priority" label="Priority">
              <Select
                options={[
                  { value: Priority.Low, label: "Low" },
                  { value: Priority.Medium, label: "Medium" },
                  { value: Priority.High, label: "High" },
                  { value: Priority.Urgent, label: "Urgent" },
                ]}
              />
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker className={styles.fullWidthDatePicker} />
            </Form.Item>
            <Form.Item name="duration" label="Duration (minutes)">
              <Input type="number" min={0} />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input />
            </Form.Item>
            <Form.Item name="assignedToId" label="Assigned To">
              {isSalesRepUser ? (
                <Input
                  value={`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
                  disabled
                />
              ) : (
                <UserSelector
                  role="SalesRep"
                  isActive
                  placeholder="Select assignee"
                />
              )}
            </Form.Item>
            <Form.Item name="relatedToType" label="Related To Type">
              <Select
                allowClear
                onChange={() => form.setFieldValue("relatedToId", undefined)}
                options={[
                  { value: RelatedToType.Client, label: "Client" },
                  { value: RelatedToType.Opportunity, label: "Opportunity" },
                  { value: RelatedToType.Proposal, label: "Proposal" },
                  { value: RelatedToType.Contract, label: "Contract" },
                  {
                    value: RelatedToType.PricingRequest,
                    label: "Pricing Request",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="relatedToId"
              label="Related To"
              dependencies={["relatedToType"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("relatedToType") && !value) {
                      return Promise.reject(
                        new Error("Please select a related entity"),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <RelatedEntitySelector relatedToType={relatedToType} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Participants Modal */}
        <Modal
          title="Activity Participants"
          open={isParticipantModalVisible}
          onCancel={() => setIsParticipantModalVisible(false)}
          footer={null}
          width={560}
        >
          {!isSalesRepUser && (
            <Form
              form={participantForm}
              layout="vertical"
              className={styles.participantForm}
            >
              <Form.Item name="userId" label="User">
                <UserSelector />
              </Form.Item>
              <Form.Item name="contactId" label="Contact ID">
                <Input placeholder="Enter contact ID" />
              </Form.Item>
              <Form.Item name="isRequired" label="Required">
                <Select
                  options={[
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                  ]}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddParticipant}
                >
                  Add Participant
                </Button>
              </Form.Item>
            </Form>
          )}

          <Table
            dataSource={participantsList}
            columns={[
              {
                title: "Name",
                key: "name",
                render: (_: unknown, record: ActivityParticipantDto) =>
                  record.userName || record.contactName || "N/A",
              },
              {
                title: "Type",
                key: "type",
                render: (_: unknown, record: ActivityParticipantDto) =>
                  record.userId ? "User" : record.contactId ? "Contact" : "N/A",
              },
              {
                title: "Required",
                dataIndex: "isRequired",
                key: "isRequired",
                render: (isRequired: boolean) => (isRequired ? "Yes" : "No"),
              },
              {
                title: "Status",
                dataIndex: "responseStatusName",
                key: "responseStatusName",
              },
            ]}
            rowKey="id"
            size="small"
            pagination={false}
          />
        </Modal>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
