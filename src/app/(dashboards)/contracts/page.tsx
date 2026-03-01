"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Card,
  Typography,
  Popconfirm,
  Tabs,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  SyncOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useContractState,
  useContractActions,
} from "@/providers/contractProvider";
import { useAuthState } from "@/providers/authProvider";
import { useClientState, useClientActions } from "@/providers/clientProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import {
  ContractDto,
  CreateContractDto,
  UpdateContractDto,
  ContractStatus,
} from "@/providers/contractProvider/types";
import {
  OpportunityStage,
  OpportunityDto,
} from "@/providers/opportunityProvider/types";
import ContractFormModal from "@/components/dashboards/contracts/ContractFormModal";
import ContractRenewalModal from "@/components/dashboards/contracts/ContractRenewalModal";
import dayjs from "dayjs";
import { useStyles } from "./style/page.style";
import { useSearchParams } from "next/navigation";

const { Title } = Typography;

const statusColors: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "default",
  [ContractStatus.Active]: "green",
  [ContractStatus.Expired]: "red",
  [ContractStatus.Renewed]: "blue",
  [ContractStatus.Cancelled]: "orange",
};
const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "Draft",
  [ContractStatus.Active]: "Active",
  [ContractStatus.Expired]: "Expired",
  [ContractStatus.Renewed]: "Renewed",
  [ContractStatus.Cancelled]: "Cancelled",
};

const toArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object" && "items" in value) {
    return (value as { items?: T[] }).items ?? [];
  }
  return [];
};

const ContractsPage = () => {
  const { styles } = useStyles();
  const { contracts, renewals, isPending } = useContractState();
  const {
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    activateContract,
    cancelContract,
    fetchExpiringContracts,
    fetchRenewals,
  } = useContractActions();
  const { clients } = useClientState();
  const { fetchClients } = useClientActions();
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const { user } = useAuthState();
  const searchParams = useSearchParams();

  // Get pre-fill data from query params
  const prefillOpportunityId = searchParams.get("opportunityId");
  const isNewFromOpportunity = searchParams.get("new") === "true";
  const renewContractId = searchParams.get("renew");

  // Get pre-fill values for the form
  const prefillValues =
    isNewFromOpportunity && prefillOpportunityId
      ? { opportunityId: prefillOpportunityId }
      : undefined;

  const [isFormOpen, setIsFormOpen] = useState(
    isNewFromOpportunity && !!prefillOpportunityId,
  );
  const [editingContract, setEditingContract] = useState<ContractDto | null>(
    null,
  );
  const [renewalContract, setRenewalContract] = useState<ContractDto | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchContracts();
    fetchClients();
    fetchOpportunities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const contractsList = toArray<ContractDto>(contracts);

  // Handle renew query parameter - open renewal modal for specific contract
  useEffect(() => {
    if (renewContractId && contractsList.length > 0) {
      const contractToRenew = contractsList.find(
        (c) => c.id === renewContractId,
      );
      if (contractToRenew) {
        fetchRenewals(contractToRenew.id);
        // Use setTimeout to avoid setState in useEffect and clear the URL param
        setTimeout(() => {
          setRenewalContract(contractToRenew);
          window.history.replaceState({}, "", "/contracts");
        }, 0);
      }
    }
  }, [renewContractId, contractsList, fetchRenewals]);

  // Get opportunity IDs that already have contracts
  const opportunityIdsWithContracts = new Set(
    contractsList.filter((c) => c.opportunityId).map((c) => c.opportunityId),
  );

  // Filter opportunities to only show "won" opportunities (ClosedWon stage) that don't have contracts
  const opportunitiesList = toArray<OpportunityDto>(opportunities);
  const wonOpportunities = opportunitiesList.filter(
    (opp) =>
      opp.stage === OpportunityStage.ClosedWon &&
      !opportunityIdsWithContracts.has(opp.id),
  );

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "expiring") fetchExpiringContracts();
    else fetchContracts();
  };

  const filteredContracts =
    activeTab === "all" || activeTab === "expiring"
      ? contractsList
      : contractsList.filter(
          (c: ContractDto) => String(c.status) === activeTab,
        );

  const handleFormSubmit = async (
    data: CreateContractDto | UpdateContractDto,
    isEdit: boolean,
  ) => {
    if (isEdit && editingContract)
      await updateContract(editingContract.id, data as UpdateContractDto);
    else await createContract(data as CreateContractDto);
    setIsFormOpen(false);
    // Clear URL params after successful submission
    if (isNewFromOpportunity) {
      window.history.pushState({}, "", "/contracts");
    }
    fetchContracts();
  };

  const handleOpenRenewals = (contract: ContractDto) => {
    setRenewalContract(contract);
    fetchRenewals(contract.id);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    // Clear URL params after closing
    if (isNewFromOpportunity) {
      window.history.pushState({}, "", "/contracts");
    }
  };

  const columns = [
    {
      title: "Contract #",
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (t: string) => t || "N/A",
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (v: number) => (v ? `R${v.toLocaleString()}` : "—"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: ContractStatus) => (
        <Tag color={statusColors[s]}>{statusLabels[s]}</Tag>
      ),
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
    ...(activeTab === "expiring"
      ? [
          {
            title: "Days Left",
            dataIndex: "daysUntilExpiry",
            key: "daysUntilExpiry",
            render: (d: number) => (
              <Tag color={d <= 30 ? "red" : d <= 60 ? "orange" : "blue"}>
                {d} days
              </Tag>
            ),
          },
        ]
      : []),
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ContractDto) => (
        <Space>
          {(record.status === ContractStatus.Draft ||
            record.status === ContractStatus.Active) && (
            <Tooltip title="Edit">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingContract(record);
                  setIsFormOpen(true);
                }}
              />
            </Tooltip>
          )}
          {record.status === ContractStatus.Draft && (
            <Tooltip title="Activate">
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={async () => {
                  await activateContract(record.id);
                  fetchContracts();
                }}
              />
            </Tooltip>
          )}
          {record.status === ContractStatus.Active && (
            <>
              <Tooltip title="Renew">
                <Button
                  type="link"
                  icon={<SyncOutlined />}
                  onClick={() => handleOpenRenewals(record)}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  type="link"
                  danger
                  icon={<CloseOutlined />}
                  onClick={async () => {
                    await cancelContract(record.id);
                    fetchContracts();
                  }}
                />
              </Tooltip>
            </>
          )}
          <Popconfirm
            title="Delete this contract?"
            onConfirm={async () => {
              await deleteContract(record.id);
              fetchContracts();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: "all", label: "All Contracts" },
    {
      key: "expiring",
      label: (
        <span>
          <WarningOutlined /> Expiring
        </span>
      ),
    },
    { key: String(ContractStatus.Draft), label: "Drafts" },
    { key: String(ContractStatus.Active), label: "Active" },
    { key: String(ContractStatus.Renewed), label: "Renewed" },
  ];

  return (
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
          <Title level={3}>Contracts</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingContract(null);
              setIsFormOpen(true);
            }}
          >
            Create Contract
          </Button>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
        />
        <Table
          columns={columns}
          dataSource={filteredContracts}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <ContractFormModal
        open={isFormOpen}
        editingContract={editingContract}
        clients={clients}
        opportunities={wonOpportunities}
        ownerId={user?.userId ?? ""}
        prefillValues={prefillValues}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />

      <ContractRenewalModal
        open={!!renewalContract}
        contract={renewalContract}
        renewals={renewals}
        onClose={() => setRenewalContract(null)}
        onRefresh={() => renewalContract && fetchRenewals(renewalContract.id)}
      />
    </div>
  );
};

export default ContractsPage;
