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
import ContractFormModal from "@/components/dashboards/contracts/ContractFormModal";
import ContractRenewalModal from "@/components/dashboards/contracts/ContractRenewalModal";
import dayjs from "dayjs";

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

const ContractsPage = () => {
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

  const [isFormOpen, setIsFormOpen] = useState(false);
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
  }, []);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    if (key === "expiring") fetchExpiringContracts();
    else fetchContracts();
  };

  const filteredContracts =
    activeTab === "all" || activeTab === "expiring"
      ? contracts
      : contracts.filter((c: ContractDto) => String(c.status) === activeTab);

  const handleFormSubmit = async (
    data: CreateContractDto | UpdateContractDto,
    isEdit: boolean,
  ) => {
    if (isEdit && editingContract)
      await updateContract(editingContract.id, data as UpdateContractDto);
    else await createContract(data as CreateContractDto);
    setIsFormOpen(false);
    fetchContracts();
  };

  const handleOpenRenewals = (contract: ContractDto) => {
    setRenewalContract(contract);
    fetchRenewals(contract.id);
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
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingContract(record);
              setIsFormOpen(true);
            }}
          />
          {record.status === ContractStatus.Draft && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={async () => {
                await activateContract(record.id);
                fetchContracts();
              }}
            />
          )}
          {record.status === ContractStatus.Active && (
            <>
              <Button
                type="link"
                icon={<SyncOutlined />}
                onClick={() => handleOpenRenewals(record)}
              >
                Renew
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseOutlined />}
                onClick={async () => {
                  await cancelContract(record.id);
                  fetchContracts();
                }}
              />
            </>
          )}
          <Popconfirm
            title="Delete?"
            onConfirm={async () => {
              await deleteContract(record.id);
              fetchContracts();
            }}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
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
    <div style={{ padding: 24 }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
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
        opportunities={opportunities}
        ownerId={user?.userId ?? ""}
        onSubmit={handleFormSubmit}
        onCancel={() => setIsFormOpen(false)}
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
