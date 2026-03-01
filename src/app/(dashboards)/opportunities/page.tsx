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
  Select,
  Typography,
  Popconfirm,
  Progress,
  Dropdown,
  message,
  Tooltip,
  Radio,
  Drawer,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
  TeamOutlined,
  TableOutlined,
  ProjectOutlined,
  EyeOutlined,
  FileTextOutlined,
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
import { useAuthState } from "@/providers/authProvider";
import OpportunityForm from "@/components/dashboards/opportunities/OpportunityForm";
import { KanbanPipeline } from "@/components/dashboards/opportunities/KanbanPipeline";
import UserSelector from "@/components/common/UserSelector";
import EntityDetailsTabs from "@/components/dashboards/common/EntityDetailsTabs";
import {
  OpportunityDto,
  OpportunityStage,
} from "@/providers/opportunityProvider/types";
import { RelatedToType } from "@/providers/noteProvider/types";
import { useStyles } from "./style/page.style";
import { useSearchParams } from "next/navigation";
import { useCreateEntityPrompts } from "@/hooks/useCreateEntityPrompts";

const { Title } = Typography;

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

type ViewMode = "table" | "kanban";

const OpportunitiesPage = () => {
  const { styles } = useStyles();
  const { opportunities, isPending, pagination } = useOpportunityState();
  const searchParams = useSearchParams();
  const {
    fetchOpportunities,
    fetchMyOpportunities,
    deleteOpportunity,
    updateStage,
    assignOpportunity,
  } = useOpportunityActions();
  const { clients } = useClientState();
  const { contacts } = useContactState();
  const { user } = useAuthState();
  const { fetchClients } = useClientActions();
  const { fetchContacts } = useContactActions();
  const { promptCreateContract, promptCreateProposal } =
    useCreateEntityPrompts();

  // Get pre-fill data from query params
  const prefillClientId = searchParams.get("clientId");
  const prefillClientName = searchParams.get("clientName");
  const prefillContactId = searchParams.get("contactId");
  const isNewFromClient = searchParams.get("new") === "true";

  // Initialize modal visibility based on URL params
  const [isModalVisible, setIsModalVisible] = useState(
    isNewFromClient && !!prefillClientId,
  );
  const [editingOpportunity, setEditingOpportunity] =
    useState<OpportunityDto | null>(null);
  const [stageFilter, setStageFilter] = useState<
    OpportunityStage | undefined
  >();
  const [assignForm] = Form.useForm();
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [assigningOpportunity, setAssigningOpportunity] =
    useState<OpportunityDto | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityDto | null>(null);

  // Pre-filled values
  const prefillValues = useMemo(() => {
    if (!isNewFromClient || !prefillClientId) return undefined;
    return {
      clientId: prefillClientId,
      contactId: prefillContactId || undefined,
      title: prefillClientName
        ? `${prefillClientName} - Opportunity`
        : undefined,
    };
  }, [isNewFromClient, prefillClientId, prefillClientName, prefillContactId]);

  const isSalesRepUser = user?.roles?.includes("SalesRep") ?? false;
  const currentUserId = user?.userId;
  const canManageAssignments =
    user?.roles?.some((role) => role === "Admin" || role === "SalesManager") ??
    false;

  // Guard against non-array state (e.g. fetchMyOpportunities returning { items: [] })
  const opportunitiesList = Array.isArray(opportunities)
    ? opportunities
    : ((opportunities as { items?: OpportunityDto[] })?.items ?? []);

  const filteredOpportunities = stageFilter
    ? opportunitiesList.filter((o) => o.stage === stageFilter)
    : opportunitiesList;

  const canUpdateOpportunity = (opportunity: OpportunityDto): boolean => {
    if (!isSalesRepUser) return true;
    return opportunity.ownerId === currentUserId;
  };

  useEffect(() => {
    if (isSalesRepUser) {
      fetchMyOpportunities();
    } else {
      fetchOpportunities();
    }
    fetchClients();
    fetchContacts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshOpportunities = () => {
    if (isSalesRepUser) {
      fetchMyOpportunities();
    } else {
      fetchOpportunities();
    }
  };

  const handleAddOpportunity = () => {
    setEditingOpportunity(null);
    setIsModalVisible(true);
  };

  const handleEditOpportunity = (opp: OpportunityDto) => {
    if (!canUpdateOpportunity(opp)) {
      message.warning("You can only update opportunities assigned to you.");
      return;
    }
    setEditingOpportunity(opp);
    setIsModalVisible(true);
  };

  const handleDeleteOpportunity = async (id: string) => {
    await deleteOpportunity(id);
    refreshOpportunities();
  };

  const handleStageChange = async (
    opportunity: OpportunityDto,
    stage: OpportunityStage,
  ) => {
    if (!canUpdateOpportunity(opportunity)) {
      message.warning("You can only update opportunities assigned to you.");
      return;
    }
    await updateStage(opportunity.id, { stage, notes: null, lossReason: null });
    refreshOpportunities();

    // Prompt for contract creation when opportunity is closed won
    if (stage === OpportunityStage.ClosedWon) {
      promptCreateContract(opportunity);
    }
    // Prompt for proposal creation when opportunity is qualified
    if (stage === OpportunityStage.Qualified) {
      promptCreateProposal(opportunity);
    }
  };

  const handleKanbanStageChange = async (
    id: string,
    stage: OpportunityStage,
  ) => {
    try {
      // Find the opportunity before updating
      const opportunity = opportunitiesList.find((o) => o.id === id);
      await updateStage(id, { stage, notes: null, lossReason: null });
      refreshOpportunities();

      // Prompt for contract creation when opportunity is closed won
      if (stage === OpportunityStage.ClosedWon && opportunity) {
        promptCreateContract(opportunity);
      }
      // Prompt for proposal creation when opportunity is qualified
      if (stage === OpportunityStage.Qualified && opportunity) {
        promptCreateProposal(opportunity);
      }
    } catch (error) {
      console.error("Failed to update stage:", error);
      message.error("Failed to update stage");
    }
  };

  const handleOpenAssignModal = (opportunity: OpportunityDto) => {
    setAssigningOpportunity(opportunity);
    assignForm.setFieldsValue({ userId: opportunity.ownerId || undefined });
    setIsAssignModalVisible(true);
  };

  const handleAssignOpportunity = async () => {
    if (!assigningOpportunity) return;
    const values = await assignForm.validateFields();
    await assignOpportunity(assigningOpportunity.id, { userId: values.userId });
    setIsAssignModalVisible(false);
    setAssigningOpportunity(null);
    assignForm.resetFields();
    refreshOpportunities();
  };

  const getStageMenuItems = (opp: OpportunityDto) =>
    Object.values(OpportunityStage)
      .filter((s) => typeof s === "number")
      .map((stage) => ({
        key: stage,
        label: stageLabels[stage as OpportunityStage],
        onClick: () => handleStageChange(opp, stage as OpportunityStage),
      }));

  const columns = [
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
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (val: number, record: OpportunityDto) =>
        `${record.currency || "R"} ${val?.toLocaleString() || 0}`,
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
      title: "Move Stage",
      key: "stageChange",
      render: (_: unknown, record: OpportunityDto) =>
        canUpdateOpportunity(record) ? (
          <Dropdown
            menu={{ items: getStageMenuItems(record) }}
            trigger={["click"]}
          >
            <Button size="small">
              Move <RightOutlined />
            </Button>
          </Dropdown>
        ) : (
          <Tag>Restricted</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: OpportunityDto) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOpportunity(record);
                setDetailsDrawerOpen(true);
              }}
            />
          </Tooltip>
          {canUpdateOpportunity(record) && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEditOpportunity(record)}
              />
            </Tooltip>
          )}
          {canManageAssignments && (
            <Tooltip title="Assign owner">
              <Button
                type="link"
                icon={<TeamOutlined />}
                onClick={() => handleOpenAssignModal(record)}
              />
            </Tooltip>
          )}
          {!isSalesRepUser && (
            <Popconfirm
              title="Delete this opportunity?"
              onConfirm={() => handleDeleteOpportunity(record.id)}
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

  const stageFilterOptions = Object.entries(stageLabels).map(
    ([key, label]) => ({
      value: Number(key),
      label,
    }),
  );

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingOpportunity(null);
    // Clear the URL parameters after closing
    if (isNewFromClient) {
      window.history.replaceState({}, "", "/opportunities");
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
          <Title level={3}>Opportunities</Title>
          <Space>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="table">
                <TableOutlined /> Table
              </Radio.Button>
              <Radio.Button value="kanban">
                <ProjectOutlined /> Pipeline
              </Radio.Button>
            </Radio.Group>

            {viewMode === "table" && (
              <Select
                placeholder="Filter by Stage"
                className={styles.stageFilterSelect}
                allowClear
                options={stageFilterOptions}
                onChange={setStageFilter}
              />
            )}

            {!isSalesRepUser && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddOpportunity}
              >
                Add Opportunity
              </Button>
            )}
          </Space>
        </div>

        {viewMode === "table" ? (
          <Table
            columns={columns}
            dataSource={filteredOpportunities}
            loading={isPending}
            rowKey="id"
            pagination={{
              current: pagination?.pageNumber,
              pageSize: pagination?.pageSize,
              total: pagination?.totalCount,
              onChange: (page, pageSize) =>
                isSalesRepUser
                  ? fetchMyOpportunities()
                  : fetchOpportunities({
                      pageNumber: page,
                      pageSize,
                      stage: stageFilter,
                    }),
            }}
          />
        ) : (
          <KanbanPipeline
            opportunities={filteredOpportunities}
            stageColors={stageColors}
            stageLabels={stageLabels}
            onStageChange={handleKanbanStageChange}
            onEditOpportunity={handleEditOpportunity}
            canUpdateOpportunity={canUpdateOpportunity}
            loading={isPending}
          />
        )}

        <OpportunityForm
          visible={isModalVisible}
          onCancel={handleModalClose}
          initialValues={editingOpportunity || undefined}
          prefillValues={prefillValues}
          clients={clients}
          contacts={contacts}
          loading={isPending}
        />

        {canManageAssignments && (
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
        )}

        {/* Details Drawer */}
        <Drawer
          title={selectedOpportunity?.title || "Opportunity Details"}
          placement="right"
          width={600}
          open={detailsDrawerOpen}
          onClose={() => {
            setDetailsDrawerOpen(false);
            setSelectedOpportunity(null);
          }}
        >
          {selectedOpportunity && (
            <EntityDetailsTabs
              relatedToType={RelatedToType.Opportunity}
              relatedToId={selectedOpportunity.id}
              relatedToTitle={selectedOpportunity.title || undefined}
            />
          )}
        </Drawer>
      </Card>
    </div>
  );
};

export default OpportunitiesPage;
