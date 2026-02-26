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
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useProposalState,
  useProposalActions,
} from "@/providers/proposalProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import {
  ProposalDto,
  CreateProposalDto,
  UpdateProposalDto,
  ProposalStatus,
  CreateProposalLineItemDto,
} from "@/providers/proposalProvider/types";
import ProposalLineItemsForm from "@/components/dashboards/proposals/ProposalLineItemsForm";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { TextArea } = Input;

const statusColors: Record<ProposalStatus, string> = {
  [ProposalStatus.Draft]: "default",
  [ProposalStatus.Submitted]: "blue",
  [ProposalStatus.Rejected]: "red",
  [ProposalStatus.Approved]: "green",
};
const statusLabels: Record<ProposalStatus, string> = {
  [ProposalStatus.Draft]: "Draft",
  [ProposalStatus.Submitted]: "Submitted",
  [ProposalStatus.Rejected]: "Rejected",
  [ProposalStatus.Approved]: "Approved",
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
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRejectModalVisible, setIsRejectModalVisible] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [editingProposal, setEditingProposal] = useState<ProposalDto | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [lineItems, setLineItems] = useState<CreateProposalLineItemDto[]>([]);
  const [form] = Form.useForm();
  const [rejectForm] = Form.useForm();

  useEffect(() => {
    fetchProposals();
    fetchOpportunities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredProposals =
    activeTab === "all"
      ? proposals
      : proposals.filter((p) => String(p.status) === activeTab);

  const handleAdd = () => {
    setEditingProposal(null);
    form.resetFields();
    setLineItems([]);
    setIsModalVisible(true);
  };

  const handleEdit = (proposal: ProposalDto) => {
    setEditingProposal(proposal);
    form.setFieldsValue({
      ...proposal,
      validUntil: proposal.validUntil ? dayjs(proposal.validUntil) : null,
    });
    setLineItems([]);
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        validUntil: values.validUntil?.toISOString() ?? null,
        lineItems:
          !editingProposal && lineItems.length > 0 ? lineItems : undefined,
      };
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

  const handleRejectConfirm = async () => {
    try {
      const values = await rejectForm.validateFields();
      if (!rejectingId) return;
      await rejectProposal(rejectingId);
      setIsRejectModalVisible(false);
      rejectForm.resetFields();
      setRejectingId(null);
      fetchProposals();
    } catch (error) {
      console.error("Reject failed:", error);
    }
  };

  const opportunityOptions = opportunities.map((opp) => ({
    value: opp.id,
    label: `${opp.title} — ${opp.clientName}`,
  }));

  const columns = [
    {
      title: "Proposal #",
      dataIndex: "proposalNumber",
      key: "proposalNumber",
      render: (t: string) => t || "N/A",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (t: string) => t || "N/A",
    },
    {
      title: "Client",
      dataIndex: "clientName",
      key: "clientName",
      render: (t: string) => t || "N/A",
    },
    {
      title: "Total Value",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (v: number) => (v ? `R${v.toLocaleString()}` : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: ProposalStatus) => (
        <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>
      ),
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ProposalDto) => (
        <Space>
          {record.status === ProposalStatus.Draft && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
          )}
          {record.status === ProposalStatus.Draft && (
            <Tooltip title="Submit for approval">
              <Button
                type="link"
                icon={<SendOutlined />}
                onClick={async () => {
                  await submitProposal(record.id);
                  fetchProposals();
                }}
              />
            </Tooltip>
          )}
          {record.status === ProposalStatus.Submitted && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={async () => {
                    await approveProposal(record.id);
                    fetchProposals();
                  }}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button
                  type="link"
                  danger
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setRejectingId(record.id);
                    setIsRejectModalVisible(true);
                  }}
                />
              </Tooltip>
            </>
          )}
          {record.status === ProposalStatus.Draft && (
            <Popconfirm
              title="Delete this proposal?"
              onConfirm={async () => {
                await deleteProposal(record.id);
                fetchProposals();
              }}
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
    { key: "all", label: "All Proposals" },
    { key: String(ProposalStatus.Draft), label: "Drafts" },
    { key: String(ProposalStatus.Submitted), label: "Submitted" },
    { key: String(ProposalStatus.Approved), label: "Approved" },
    { key: String(ProposalStatus.Rejected), label: "Rejected" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Title level={3}>Proposals</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
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
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingProposal ? "Edit Proposal" : "Create Proposal"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="opportunityId"
            label="Opportunity"
            rules={[
              { required: true, message: "Please select an opportunity" },
            ]}
          >
            <Select
              placeholder="Select an opportunity"
              showSearch
              options={opportunityOptions}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item name="currency" label="Currency" initialValue="ZAR">
            <Select
              options={[
                { value: "ZAR", label: "ZAR" },
                { value: "USD", label: "USD" },
                { value: "EUR", label: "EUR" },
              ]}
            />
          </Form.Item>
          <Form.Item name="validUntil" label="Valid Until">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>

        {!editingProposal && (
          <div style={{ marginTop: 16 }}>
            <Text strong>Line Items</Text>
            <div style={{ marginTop: 8 }}>
              <ProposalLineItemsForm
                lineItems={lineItems}
                onChange={setLineItems}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Reject Proposal"
        open={isRejectModalVisible}
        onOk={handleRejectConfirm}
        onCancel={() => {
          setIsRejectModalVisible(false);
          rejectForm.resetFields();
          setRejectingId(null);
        }}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <Form form={rejectForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Rejection Reason"
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea
              rows={3}
              placeholder="e.g. Pricing too high, revise and resubmit"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProposalsPage;
