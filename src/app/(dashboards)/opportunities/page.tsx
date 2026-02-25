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
  InputNumber,
  DatePicker,
  Typography,
  Popconfirm,
  Progress,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import { useClientState } from "@/providers/clientProvider";
import { useContactState } from "@/providers/contactProvider";
import {
  OpportunityDto,
  CreateOpportunityDto,
  UpdateOpportunityDto,
  OpportunityStage,
  OpportunitySource,
} from "@/providers/opportunityProvider/types";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const stageColors: Record<OpportunityStage, string> = {
  [OpportunityStage.Lead]: "default",
  [OpportunityStage.Qualified]: "blue",
  [OpportunityStage.Proposal]: "orange",
  [OpportunityStage.Negotiation]: "purple",
  [OpportunityStage.ClosedWon]: "green",
  [OpportunityStage.ClosedLost]: "red",
};
const stageLabels: Record<OpportunityStage, string> = {
  [OpportunityStage.Lead]: "Lead",
  [OpportunityStage.Qualified]: "Qualified",
  [OpportunityStage.Proposal]: "Proposal",
  [OpportunityStage.Negotiation]: "Negotiation",
  [OpportunityStage.ClosedWon]: "Closed Won",
  [OpportunityStage.ClosedLost]: "Closed Lost",
};

const OpportunitiesPage = () => {
  const { opportunities, isPending, pagination } = useOpportunityState();
  const {
    fetchOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    updateStage,
  } = useOpportunityActions();
  const { clients } = useClientState();
  const { contacts } = useContactState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOpportunity, setEditingOpportunity] =
    useState<OpportunityDto | null>(null);
  const [stageFilter, setStageFilter] = useState<
    OpportunityStage | undefined
  >();
  const [form] = Form.useForm();

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleAddOpportunity = () => {
    setEditingOpportunity(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleEditOpportunity = (opp: OpportunityDto) => {
    setEditingOpportunity(opp);
    form.setFieldsValue({
      ...opp,
      expectedCloseDate: opp.expectedCloseDate
        ? dayjs(opp.expectedCloseDate)
        : null,
    });
    setIsModalVisible(true);
  };
  const handleDeleteOpportunity = async (id: string) => {
    await deleteOpportunity(id);
    fetchOpportunities();
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        expectedCloseDate: values.expectedCloseDate?.toISOString(),
      };
      if (editingOpportunity) {
        await updateOpportunity(editingOpportunity.id, data);
      } else {
        await createOpportunity(data as CreateOpportunityDto);
      }
      setIsModalVisible(false);
      fetchOpportunities();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleStageChange = async (id: string, newStage: OpportunityStage) => {
    await updateStage(id, { newStage, notes: null, lossReason: null });
    fetchOpportunities();
  };

  const getStageMenuItems = (opp: OpportunityDto) =>
    Object.values(OpportunityStage)
      .filter((s) => typeof s === "number")
      .map((stage) => ({
        key: stage,
        label: stageLabels[stage as OpportunityStage],
        onClick: () => handleStageChange(opp.id, stage as OpportunityStage),
      }));

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "N/A",
    },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (val: number, record: OpportunityDto) =>
        `${record.currency || "$"} ${val?.toLocaleString() || 0}`,
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (prob: number) => <Progress percent={prob} size="small" />,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage: OpportunityStage) => (
        <Tag color={stageColors[stage]}>{stageLabels[stage]}</Tag>
      ),
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Stage",
      key: "stageChange",
      render: (_: unknown, record: OpportunityDto) => (
        <Dropdown
          menu={{ items: getStageMenuItems(record) }}
          trigger={["click"]}
        >
          <Button size="small">
            Move <RightOutlined />
          </Button>
        </Dropdown>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: OpportunityDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditOpportunity(record)}
          />
          <Popconfirm
            title="Delete this opportunity?"
            onConfirm={() => handleDeleteOpportunity(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
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
          <Title level={3}>Opportunities</Title>
          <Space>
            <Select
              placeholder="Filter by Stage"
              style={{ width: 150 }}
              allowClear
              onChange={setStageFilter}
            >
              {Object.entries(stageLabels).map(([key, label]) => (
                <Option key={key} value={Number(key)}>
                  {label}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddOpportunity}
            >
              Add Opportunity
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={opportunities}
          loading={isPending}
          rowKey="id"
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.totalCount,
            onChange: (page, pageSize) =>
              fetchOpportunities({
                pageNumber: page,
                pageSize,
                stage: stageFilter,
              }),
          }}
        />
        <Modal
          title={editingOpportunity ? "Edit Opportunity" : "Add Opportunity"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="clientId"
              label="Client"
              rules={[{ required: true }]}
            >
              <Select>
                {clients.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="contactId" label="Contact">
              <Select allowClear>
                {contacts.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.fullName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Title">
              <Input />
            </Form.Item>
            <Form.Item name="estimatedValue" label="Value">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="currency" label="Currency">
              <Input placeholder="USD" />
            </Form.Item>
            <Form.Item name="probability" label="Probability (%)">
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="stage" label="Stage" rules={[{ required: true }]}>
              <Select>
                {Object.entries(stageLabels).map(([key, label]) => (
                  <Option key={key} value={Number(key)}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="source" label="Source">
              <Select>
                {Object.values(OpportunitySource)
                  .filter((s) => typeof s === "number")
                  .map((s) => (
                    <Option key={s} value={s}>
                      {OpportunitySource[s]}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item name="expectedCloseDate" label="Expected Close Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default OpportunitiesPage;
