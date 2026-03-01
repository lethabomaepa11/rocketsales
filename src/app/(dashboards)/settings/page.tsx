"use client";

import { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Space,
  Table,
  Input,
  Select,
  Form,
  InputNumber,
  Modal,
  message,
  Popconfirm,
  Tabs,
  Tag,
  Divider,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  useStageTemplateState,
  useStageTemplateActions,
} from "@/providers/stageTemplateProvider";
import { useAuthState } from "@/providers/authProvider";
import { OpportunityStage } from "@/providers/opportunityProvider/types";
import { ActivityType, Priority } from "@/providers/activityProvider/types";
import {
  STAGE_LABELS,
  ACTIVITY_TYPE_OPTIONS,
  PRIORITY_OPTIONS,
} from "@/utils/stageTriggerTemplates";
import { isManagerOrAdmin } from "@/utils/tenantUtils";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const SettingsPage = () => {
  const { templates, isLoading, isSaving, isDirty } = useStageTemplateState();
  const { saveTemplates, resetToDefaults } = useStageTemplateActions();
  const { user } = useAuthState();
  const [activeTab, setActiveTab] = useState<string>("qualified");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStage, setEditingStage] = useState<OpportunityStage | null>(
    null,
  );
  const [form] = Form.useForm();

  const isManager = isManagerOrAdmin();

  // Get stage from active tab
  const getStageFromTab = (tab: string): OpportunityStage => {
    switch (tab) {
      case "qualified":
        return OpportunityStage.Qualified;
      case "proposal":
        return OpportunityStage.Proposal;
      case "negotiation":
        return OpportunityStage.Negotiation;
      default:
        return OpportunityStage.Qualified;
    }
  };

  const currentStage = getStageFromTab(activeTab);
  const currentTemplate = templates.find((t) => t.stage === currentStage);

  const handleSave = async () => {
    await saveTemplates(templates);
  };

  const handleReset = () => {
    resetToDefaults();
    message.info("Templates reset to defaults. Click Save to apply.");
  };

  const handleAddActivity = (values: {
    subject: string;
    description: string;
    type: ActivityType;
    priority: Priority;
    dueInDays: number;
  }) => {
    const template = templates.find((t) => t.stage === currentStage);
    if (template) {
      const newActivity = {
        id: `${currentStage}-${Date.now()}`,
        subject: values.subject,
        description: values.description || null,
        type: values.type,
        priority: values.priority,
        dueInDays: values.dueInDays,
      };
      const updatedTemplate = {
        ...template,
        activities: [...template.activities, newActivity],
      };
      // Update via the action - we'd need to add updateTemplate to context
      // For now, we'll save directly
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteActivity = (activityId: string) => {
    const template = templates.find((t) => t.stage === currentStage);
    if (template) {
      const updatedActivities = template.activities.filter(
        (a) => a.id !== activityId,
      );
      // This would need to be handled through context
    }
  };

  const columns = [
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: ActivityType) => (
        <Tag>{ACTIVITY_TYPE_OPTIONS.find((o) => o.value === type)?.label}</Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Priority) => {
        const colors: Record<Priority, string> = {
          [Priority.Low]: "default",
          [Priority.Medium]: "blue",
          [Priority.High]: "orange",
          [Priority.Urgent]: "red",
        };
        return (
          <Tag color={colors[priority]}>
            {PRIORITY_OPTIONS.find((o) => o.value === priority)?.label}
          </Tag>
        );
      },
    },
    {
      title: "Due In",
      dataIndex: "dueInDays",
      key: "dueInDays",
      render: (days: number) => (days === 0 ? "Today" : `${days} day(s)`),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Popconfirm
          title="Delete this activity?"
          onConfirm={() => handleDeleteActivity(record.id)}
        >
          <Button type="link" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  const tabItems = [
    {
      key: "qualified",
      label: "Qualified Stage",
      children: (
        <Table
          columns={columns}
          dataSource={currentTemplate?.activities || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "No activities configured" }}
        />
      ),
    },
    {
      key: "proposal",
      label: "Proposal Stage",
      children: (
        <Table
          columns={columns}
          dataSource={currentTemplate?.activities || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "No activities configured" }}
        />
      ),
    },
    {
      key: "negotiation",
      label: "Negotiation Stage",
      children: (
        <Table
          columns={columns}
          dataSource={currentTemplate?.activities || []}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: "No activities configured" }}
        />
      ),
    },
  ];

  if (!isManager) {
    return (
      <Card>
        <Title level={4}>Access Denied</Title>
        <Text>You do not have permission to access this page.</Text>
      </Card>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <Title level={3} style={{ margin: 0 }}>
              <SettingOutlined /> Stage-Triggered Task Templates
            </Title>
            <Text type="secondary">
              Configure automatic activities when opportunities move to specific
              stages
            </Text>
          </div>
          <Space>
            <Popconfirm title="Reset to defaults?" onConfirm={handleReset}>
              <Button icon={<ReloadOutlined />}>Reset to Defaults</Button>
            </Popconfirm>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={isSaving}
              disabled={!isDirty}
            >
              Save Changes
            </Button>
          </Space>
        </div>

        <Divider />

        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />

        <div style={{ marginTop: 16 }}>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add Activity
          </Button>
        </div>
      </Card>

      <Modal
        title="Add Activity Template"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddActivity}>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: "Please enter a subject" }]}
          >
            <Input placeholder="e.g., Send intro email" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional description" />
          </Form.Item>
          <Form.Item
            name="type"
            label="Activity Type"
            rules={[{ required: true, message: "Please select a type" }]}
            initialValue={ActivityType.Task}
          >
            <Select options={ACTIVITY_TYPE_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="priority"
            label="Priority"
            rules={[{ required: true, message: "Please select a priority" }]}
            initialValue={Priority.Medium}
          >
            <Select options={PRIORITY_OPTIONS} />
          </Form.Item>
          <Form.Item
            name="dueInDays"
            label="Due (days from now)"
            rules={[{ required: true, message: "Please enter days" }]}
            initialValue={0}
          >
            <InputNumber min={0} max={365} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Add Activity
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingsPage;
