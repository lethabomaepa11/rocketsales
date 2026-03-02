"use client";

import { useEffect, useState, useMemo } from "react";
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
  Drawer,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
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
import { useStyles } from "./style/page.style";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import { OpportunityStage } from "@/providers/opportunityProvider/types";
import { useCreateEntityPrompts } from "@/hooks/useCreateEntityPrompts";
import EntityDetailsTabs from "@/components/dashboards/common/EntityDetailsTabs";
import { RelatedToType } from "@/providers/noteProvider/types";

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
  const { styles } = useStyles();
  const { proposals, isPending } = useProposalState();
  const searchParams = useSearchParams();
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
  const { fetchOpportunities, updateStage } = useOpportunityActions();
  const { promptCreateContract } = useCreateEntityPrompts();

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

  // Drawer state for viewing proposal details
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalDto | null>(
    null,
  );

  // Get pre-fill data from query params
  const prefillOpportunityId = searchParams.get("opportunityId");
  const prefillClientId = searchParams.get("clientId");
  const prefillClientName = searchParams.get("clientName");
  const prefillTitle = searchParams.get("title");
  const prefillDescription = searchParams.get("description");
  const prefillValidUntil = searchParams.get("validUntil");
  const prefillLineItemsJson = searchParams.get("lineItems");
  const isNewFromOpportunity = searchParams.get("new") === "true";

  // Parse line items from query param
  const prefillLineItems = useMemo(() => {
    if (!prefillLineItemsJson) return [];
    try {
      return JSON.parse(
        decodeURIComponent(prefillLineItemsJson),
      ) as CreateProposalLineItemDto[];
    } catch {
      return [];
    }
  }, [prefillLineItemsJson]);

  // Pre-filled values for new proposal from opportunity or pricing request
  const prefillValues = useMemo(() => {
    if (!isNewFromOpportunity || !prefillOpportunityId) return undefined;
    return {
      opportunityId: prefillOpportunityId,
      title:
        prefillTitle ||
        (prefillClientName ? `${prefillClientName} - Proposal` : undefined),
      description: prefillDescription || undefined,
      validUntil: prefillValidUntil ? dayjs(prefillValidUntil) : undefined,
    };
  }, [
    isNewFromOpportunity,
    prefillOpportunityId,
    prefillClientName,
    prefillTitle,
    prefillDescription,
    prefillValidUntil,
  ]);

  // Initialize modal visibility based on URL params
  useEffect(() => {
    if (isNewFromOpportunity && prefillOpportunityId) {
      setIsModalVisible(true);
      form.setFieldsValue({
        opportunityId: prefillOpportunityId,
        title:
          prefillTitle ||
          (prefillClientName ? `${prefillClientName} - Proposal` : undefined),
        description: prefillDescription || undefined,
        validUntil: prefillValidUntil ? dayjs(prefillValidUntil) : null,
      });
      // Pre-fill line items if available
      if (prefillLineItems.length > 0) {
        setLineItems(prefillLineItems);
      }
    }
  }, [
    isNewFromOpportunity,
    prefillOpportunityId,
    prefillClientName,
    prefillTitle,
    prefillDescription,
    prefillValidUntil,
    prefillLineItems,
    form,
  ]);

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

  const handleViewDetails = (proposal: ProposalDto) => {
    setSelectedProposal(proposal);
    setDetailsDrawerOpen(true);
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
        const createdProposal = await createProposal(data as CreateProposalDto);

        // Auto-update opportunity stage to Proposal when proposal is created
        if (data.opportunityId) {
          await updateStage(data.opportunityId, {
            stage: OpportunityStage.Proposal,
            notes: null,
            lossReason: null,
          });
        }
      }
      setIsModalVisible(false);
      fetchProposals();
      fetchOpportunities();

      // Clear URL params after successful creation
      if (isNewFromOpportunity) {
        window.history.replaceState({}, "", "/proposals");
      }
    } catch (error) {
      message.error("Validation failed");
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
      message.error("Reject failed");
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
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
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

                    // Find the opportunity and prompt for contract
                    const opportunity = opportunities.find(
                      (o) => o.id === record.opportunityId,
                    );
                    if (opportunity) {
                      promptCreateContract({
                        id: opportunity.id,
                        title: opportunity.title,
                        clientId: opportunity.clientId,
                        clientName: opportunity.clientName,
                        estimatedValue: opportunity.estimatedValue,
                        currency: opportunity.currency,
                      });
                    }
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
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
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
            <DatePicker className={styles.fullWidthDatePicker} />
          </Form.Item>
        </Form>

        {!editingProposal && (
          <div className={styles.lineItemsSection}>
            <Text strong>Line Items</Text>
            <div className={styles.lineItemsWrapper}>
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

      {/* Details Drawer */}
      <Drawer
        title={selectedProposal?.title || "Proposal Details"}
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        width={600}
      >
        {selectedProposal && (
          <EntityDetailsTabs
            relatedToType={RelatedToType.Proposal}
            relatedToId={selectedProposal.id}
            relatedToTitle={selectedProposal.title || undefined}
          />
        )}
      </Drawer>
    </div>
  );
};

export default ProposalsPage;
