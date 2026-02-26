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
  const { activities, participants, isPending } = useActivityState();
  const {
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    completeActivity,
    cancelActivity,
    fetchParticipants,
    addParticipant,
  } = useActivityActions();
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
  const relatedToType = Form.useWatch("relatedToType", form); // add this

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities =
    activeTab === "all"
      ? activities
      : activities.filter((a: ActivityDto) => String(a.status) === activeTab);

  const handleAddActivity = () => {
    setEditingActivity(null);
    form.resetFields();
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
    fetchActivities();
  };
  const handleCompleteActivity = async (id: string) => {
    await completeActivity(id);
    fetchActivities();
  };
  const handleCancelActivity = async (id: string) => {
    await cancelActivity(id);
    fetchActivities();
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, dueDate: values.dueDate?.toISOString() };
      if (editingActivity) {
        await updateActivity(editingActivity.id, data as UpdateActivityDto);
      } else {
        await createActivity(data as CreateActivityDto);
      }
      setIsModalVisible(false);
      fetchActivities();
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
          <span style={{ color: record.isOverdue ? "red" : undefined }}>
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
            <Text type="secondary" style={{ fontSize: 12 }}>
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditActivity(record)}
          />
          {record.status !== ActivityStatus.Completed && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleCompleteActivity(record.id)}
            />
          )}
          {record.status !== ActivityStatus.Completed && (
            <Button
              type="link"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancelActivity(record.id)}
            />
          )}
          <Popconfirm
            title="Delete this activity?"
            onConfirm={() => handleDeleteActivity(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
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
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
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
              ></Select>
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="duration" label="Duration (minutes)">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="location" label="Location">
              <Input />
            </Form.Item>
            <Form.Item name="assignedToId" label="Assigned To">
              <UserSelector />
            </Form.Item>
            <Form.Item name="relatedToType" label="Related To Type">
              <Select
                onChange={() => {
                  form.setFieldValue("relatedToId", undefined);
                }}
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
                    const relatedToType = getFieldValue("relatedToType");
                    if (relatedToType && !value) {
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
        <Modal
          title="Activity Participants"
          open={isParticipantModalVisible}
          onCancel={() => setIsParticipantModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={participantForm}
            layout="inline"
            style={{ marginBottom: 16 }}
          >
            <Form.Item name="userId" label="User ID">
              <Input placeholder="User ID" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="contactId" label="Contact ID">
              <Input placeholder="Contact ID" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item name="isRequired" label="Required">
              <Select style={{ width: 80 }}>
                <Select.Option value={true}>Yes</Select.Option>
                <Select.Option value={false}>No</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddParticipant}
              >
                Add
              </Button>
            </Form.Item>
          </Form>
          <Table
            dataSource={participants}
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
