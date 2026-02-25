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
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CalendarOutlined,
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
} from "@/providers/activityProvider/types";
import dayjs from "dayjs";

const { Title } = Typography;

const statusColors: Record<ActivityStatus, string> = {
  [ActivityStatus.Pending]: "default",
  [ActivityStatus.InProgress]: "blue",
  [ActivityStatus.Completed]: "green",
};
const statusLabels: Record<ActivityStatus, string> = {
  [ActivityStatus.Pending]: "Pending",
  [ActivityStatus.InProgress]: "In Progress",
  [ActivityStatus.Completed]: "Completed",
};
const typeLabels: Record<ActivityType, string> = {
  [ActivityType.Call]: "Call",
  [ActivityType.Meeting]: "Meeting",
  [ActivityType.Email]: "Email",
  [ActivityType.Task]: "Task",
  [ActivityType.Note]: "Note",
};

const ActivitiesPage = () => {
  const { activities, isPending } = useActivityState();
  const {
    fetchActivities,
    createActivity,
    updateActivity,
    deleteActivity,
    completeActivity,
    cancelActivity,
  } = useActivityActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ActivityDto | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();

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

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => text || "N/A",
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
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
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
      render: (text: string) => text || "N/A",
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
          <Button
            type="link"
            danger
            icon={<CloseOutlined />}
            onClick={() => handleCancelActivity(record.id)}
          />
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
    { key: String(ActivityStatus.Pending), label: "Pending" },
    { key: String(ActivityStatus.InProgress), label: "In Progress" },
    { key: String(ActivityStatus.Completed), label: "Completed" },
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
              <Select>
                <Select.Option value={ActivityType.Call}>Call</Select.Option>
                <Select.Option value={ActivityType.Meeting}>
                  Meeting
                </Select.Option>
                <Select.Option value={ActivityType.Email}>Email</Select.Option>
                <Select.Option value={ActivityType.Task}>Task</Select.Option>
                <Select.Option value={ActivityType.Note}>Note</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="dueDate" label="Due Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="assignedToId" label="Assigned To">
              <Input />
            </Form.Item>
            <Form.Item name="relatedToType" label="Related To Type">
              <Input />
            </Form.Item>
            <Form.Item name="relatedToId" label="Related To ID">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
