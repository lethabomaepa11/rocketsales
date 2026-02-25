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
  InputNumber,
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
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  useProposalState,
  useProposalActions,
} from "@/providers/proposalProvider";
import {
  ProposalDto,
  CreateProposalDto,
  UpdateProposalDto,
  ProposalStatus,
} from "@/providers/proposalProvider/types";
import dayjs from "dayjs";

const { Title } = Typography;
const { TextArea } = Input;

const statusColors: Record<ProposalStatus, string> = {
  [ProposalStatus.Draft]: "default",
  [ProposalStatus.Sent]: "blue",
  [ProposalStatus.Accepted]: "green",
  [ProposalStatus.Rejected]: "red",
  [ProposalStatus.Viewed]: "orange",
  [ProposalStatus.Expired]: "default",
};
const statusLabels: Record<ProposalStatus, string> = {
  [ProposalStatus.Draft]: "Draft",
  [ProposalStatus.Sent]: "Sent",
  [ProposalStatus.Accepted]: "Approved",
  [ProposalStatus.Rejected]: "Rejected",
  [ProposalStatus.Viewed]: "Viewed",
  [ProposalStatus.Expired]: "Expired",
};

const ProposalsPage = () => {
  const { proposals, isPending } = useProposalState();
  const {
    fetchProposals,
    createProposal,
    updateProposal,
    deleteProposal,
    submitProposal,
    approveProposal,
    rejectProposal,
  } = useProposalActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProposal, setEditingProposal] = useState<ProposalDto | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProposals();
  }, []);

  const filteredProposals =
    activeTab === "all"
      ? proposals
      : proposals.filter((p) => String(p.status) === activeTab);

  const handleAddProposal = () => {
    setEditingProposal(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleEditProposal = (proposal: ProposalDto) => {
    setEditingProposal(proposal);
    form.setFieldsValue({
      ...proposal,
      validUntil: proposal.validUntil ? dayjs(proposal.validUntil) : null,
    });
    setIsModalVisible(true);
  };
  const handleDeleteProposal = async (id: string) => {
    await deleteProposal(id);
    fetchProposals();
  };
  const handleSubmitProposal = async (id: string) => {
    await submitProposal(id);
    fetchProposals();
  };
  const handleApproveProposal = async (id: string) => {
    await approveProposal(id);
    fetchProposals();
  };
  const handleRejectProposal = async (id: string) => {
    await rejectProposal(id);
    fetchProposals();
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = { ...values, validUntil: values.validUntil?.toISOString() };
      if (editingProposal) {
        await updateProposal(editingProposal.id, data as UpdateProposalDto);
      } else {
        await createProposal(data as CreateProposalDto);
      }
      setIsModalVisible(false);
      fetchProposals();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Proposal #",
      dataIndex: "proposalNumber",
      key: "proposalNumber",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Total Value",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (value: number) => (value ? `$${value.toLocaleString()}` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ProposalStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ProposalDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditProposal(record)}
          />
          {record.status === ProposalStatus.Draft && (
            <Button
              type="link"
              icon={<SendOutlined />}
              onClick={() => handleSubmitProposal(record.id)}
            />
          )}
          {record.status === ProposalStatus.Sent && (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => handleApproveProposal(record.id)}
              />
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleRejectProposal(record.id)}
              />
            </>
          )}
          <Popconfirm
            title="Delete this proposal?"
            onConfirm={() => handleDeleteProposal(record.id)}
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
    { key: "all", label: "All Proposals" },
    { key: String(ProposalStatus.Draft), label: "Drafts" },
    { key: String(ProposalStatus.Sent), label: "Sent" },
    { key: String(ProposalStatus.Accepted), label: "Approved" },
    { key: String(ProposalStatus.Rejected), label: "Rejected" },
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
          <Title level={3}>Proposals</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddProposal}
          >
            Create Proposal
          </Button>
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <Table
          columns={columns}
          dataSource={filteredProposals}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingProposal ? "Edit Proposal" : "Create Proposal"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item name="opportunityId" label="Opportunity">
              <Input />
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item name="totalValue" label="Total Value">
              <InputNumber style={{ width: "100%" }} min={0} precision={2} />
            </Form.Item>
            <Form.Item name="validUntil" label="Valid Until">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ProposalsPage;
