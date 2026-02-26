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
  TeamOutlined,
} from "@ant-design/icons";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import { useClientState, useClientActions } from "@/providers/clientProvider";
import {
  useContactState,
  useContactActions,
} from "@/providers/contactProvider";
import OpportunityForm from "@/components/dashboards/opportunities/OpportunityForm";
import UserSelector from "@/components/common/UserSelector";
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
    assignOpportunity,
  } = useOpportunityActions();
  const { clients } = useClientState();
  const { contacts } = useContactState();
  const { fetchClients } = useClientActions();
  const { fetchContacts } = useContactActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingOpportunity, setEditingOpportunity] =
    useState<OpportunityDto | null>(null);
  const [stageFilter, setStageFilter] = useState<
    OpportunityStage | undefined
  >();
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assigningOpportunity, setAssigningOpportunity] =
    useState<OpportunityDto | null>(null);

  useEffect(() => {
    fetchOpportunities();
    fetchClients();
    fetchContacts();
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
      console.log(values);
      const data = {
        ...values,
        expectedCloseDate: values.expectedCloseDate?.toISOString(),
      };
      if (editingOpportunity) {
        await updateOpportunity(editingOpportunity.id, data);
      } else {
        console.log(data);
        await createOpportunity(data as CreateOpportunityDto);
      }
      setIsModalVisible(false);
      fetchOpportunities();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleStageChange = async (id: string, stage: OpportunityStage) => {
    await updateStage(id, { stage, notes: null, lossReason: null });
    fetchOpportunities();
  };

  const handleOpenAssignModal = (opportunity: OpportunityDto) => {
    setAssigningOpportunity(opportunity);
    assignForm.setFieldsValue({ userId: opportunity.ownerId || undefined });
    setIsAssignModalVisible(true);
  };

  const handleAssignOpportunity = async () => {
    if (!assigningOpportunity) {
      return;
    }

    const values = await assignForm.validateFields();
    await assignOpportunity(assigningOpportunity.id, { userId: values.userId });
    setIsAssignModalVisible(false);
    setAssigningOpportunity(null);
    assignForm.resetFields();
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
      render: (stage: OpportunityStage, record: OpportunityDto) => (
        <Tag color={stageColors[stage]}>
          {record.stageName || stageLabels[stage] || `Stage ${stage}`}
        </Tag>
      ),
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (ownerName: string | null) => ownerName || "Unassigned",
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
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => handleOpenAssignModal(record)}
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
        <OpportunityForm
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          initialValues={editingOpportunity || undefined}
          clients={clients}
          contacts={contacts}
          loading={isPending}
        />

        <Modal
          title="Assign Opportunity Owner"
          open={isAssignModalVisible}
          onOk={handleAssignOpportunity}
          onCancel={() => {
            setIsAssignModalVisible(false);
            setAssigningOpportunity(null);
            assignForm.resetFields();
          }}
        >
          <Form form={assignForm} layout="vertical">
            <Form.Item
              name="userId"
              label="Owner"
              rules={[{ required: true, message: "Please select an owner" }]}
            >
              <UserSelector
                role="SalesRep"
                isActive
                placeholder="Select opportunity owner"
                allowClear={false}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default OpportunitiesPage;
