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
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  useContractState,
  useContractActions,
} from "@/providers/contractProvider";
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
import dayjs from "dayjs";

const { Title } = Typography;

const statusColors: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "default",
  [ContractStatus.Active]: "green",
  [ContractStatus.Expired]: "red",
  [ContractStatus.Cancelled]: "orange",
  [ContractStatus.Terminated]: "default",
};
const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "Draft",
  [ContractStatus.Active]: "Active",
  [ContractStatus.Expired]: "Expired",
  [ContractStatus.Cancelled]: "Cancelled",
  [ContractStatus.Terminated]: "Terminated",
};

const ContractsPage = () => {
  const { contracts, isPending } = useContractState();
  const {
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
    activateContract,
    cancelContract,
  } = useContractActions();
  const { clients } = useClientState();
  const { fetchClients } = useClientActions();
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContract, setEditingContract] = useState<ContractDto | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContracts();
    fetchClients();
    fetchOpportunities();
  }, []);

  const filteredContracts =
    activeTab === "all"
      ? contracts
      : contracts.filter((c: ContractDto) => String(c.status) === activeTab);

  const handleAddContract = () => {
    setEditingContract(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleEditContract = (contract: ContractDto) => {
    setEditingContract(contract);
    form.setFieldsValue({
      ...contract,
      startDate: contract.startDate ? dayjs(contract.startDate) : null,
      endDate: contract.endDate ? dayjs(contract.endDate) : null,
    });
    setIsModalVisible(true);
  };
  const handleDeleteContract = async (id: string) => {
    await deleteContract(id);
    fetchContracts();
  };
  const handleActivateContract = async (id: string) => {
    await activateContract(id);
    fetchContracts();
  };
  const handleCancelContract = async (id: string) => {
    await cancelContract(id);
    fetchContracts();
  };
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        startDate: values.startDate?.toISOString(),
        endDate: values.endDate?.toISOString(),
      };
      if (editingContract) {
        await updateContract(editingContract.id, data as UpdateContractDto);
      } else {
        await createContract(data as CreateContractDto);
      }
      setIsModalVisible(false);
      fetchContracts();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Contract #",
      dataIndex: "contractNumber",
      key: "contractNumber",
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
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (value: number) => (value ? `$${value.toLocaleString()}` : "N/A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ContractStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ContractDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditContract(record)}
          />
          {record.status === ContractStatus.Draft && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleActivateContract(record.id)}
            />
          )}
          {record.status === ContractStatus.Active && (
            <Button
              type="link"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancelContract(record.id)}
            />
          )}
          <Popconfirm
            title="Delete this contract?"
            onConfirm={() => handleDeleteContract(record.id)}
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
    { key: "all", label: "All Contracts" },
    { key: String(ContractStatus.Draft), label: "Drafts" },
    { key: String(ContractStatus.Active), label: "Active" },
    { key: String(ContractStatus.Expired), label: "Expired" },
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
          <Title level={3}>Contracts</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddContract}
          >
            Create Contract
          </Button>
        </div>
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
        <Table
          columns={columns}
          dataSource={filteredContracts}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingContract ? "Edit Contract" : "Create Contract"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="clientId"
              label="Client"
              rules={[{ required: true, message: "Please select a client" }]}
            >
              <Select
                placeholder="Select a client"
                showSearch
                optionFilterProp="children"
              >
                {clients.map((client) => (
                  <Select.Option key={client.id} value={client.id}>
                    {client.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="opportunityId" label="Opportunity (Optional)">
              <Select
                placeholder="Select an opportunity"
                showSearch
                optionFilterProp="children"
                allowClear
              >
                {opportunities.map((opp) => (
                  <Select.Option key={opp.id} value={opp.id}>
                    {opp.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contractValue" label="Total Value">
              <InputNumber style={{ width: "100%" }} min={0} precision={2} />
            </Form.Item>
            <Form.Item name="currency" label="Currency">
              <Select placeholder="Select currency">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
                <Select.Option value="GBP">GBP</Select.Option>
                <Select.Option value="ZAR">ZAR</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="endDate" label="End Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="renewalNoticePeriod"
              label="Renewal Notice Period (days)"
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="autoRenew"
              label="Auto Renew"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item name="terms" label="Terms">
              <Input.TextArea rows={3} />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ContractsPage;
