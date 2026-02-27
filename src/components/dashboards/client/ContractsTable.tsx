import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  Switch,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  ContractDto,
  ContractStatus,
  CreateContractDto,
} from "@/providers/contractProvider/types";
import { useContractActions } from "@/providers/contractProvider";
import { useOpportunityState } from "@/providers/opportunityProvider";
import { useRouter } from "next/navigation";
import { useStyles } from "./style/page.style";

interface ContractsTableProps {
  contracts: ContractDto[];
  clientId: string;
  loading: boolean;
}

const statusColors: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "default",
  [ContractStatus.Active]: "green",
  [ContractStatus.Expired]: "red",
  [ContractStatus.Renewed]: "blue",
  [ContractStatus.Cancelled]: "gray",
};

const statusLabels: Record<ContractStatus, string> = {
  [ContractStatus.Draft]: "Draft",
  [ContractStatus.Active]: "Active",
  [ContractStatus.Expired]: "Expired",
  [ContractStatus.Renewed]: "Renewed",
  [ContractStatus.Cancelled]: "Cancelled",
};

const ContractsTable: React.FC<ContractsTableProps> = ({
  contracts,
  clientId,
  loading,
}) => {
  const { styles } = useStyles();
  const router = useRouter();
  const { createContract, fetchContracts } = useContractActions();
  const { opportunities } = useOpportunityState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleView = (id: string) => {
    router.push(`/contracts?id=${id}`);
  };

  const handleAddContract = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await createContract({
        ...values,
        clientId,
        contractValue: values.contractValue || 0,
        currency: values.currency || "ZAR",
        autoRenew: values.autoRenew || false,
      } as CreateContractDto);
      message.success("Contract created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchContracts({ clientId });
    } catch (error) {
      console.error("Failed to create contract:", error);
      message.error("Failed to create contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      key: "opportunityTitle",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "Contract Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (val: number, record: ContractDto) =>
        `${record.currency || "R"} ${val?.toLocaleString() || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ContractStatus, record: ContractDto) => (
        <Tag color={statusColors[status]}>
          {record.statusName || statusLabels[status] || `Status ${status}`}
        </Tag>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string, record: ContractDto) => (
        <span style={{ color: record.isExpiringSoon ? "red" : undefined }}>
          {date ? new Date(date).toLocaleDateString() : "N/A"}
          {record.isExpiringSoon && " (Expiring Soon)"}
        </span>
      ),
    },
    {
      title: "Auto Renew",
      dataIndex: "autoRenew",
      key: "autoRenew",
      render: (autoRenew: boolean) => (
        <Tag color={autoRenew ? "green" : "default"}>
          {autoRenew ? "Yes" : "No"}
        </Tag>
      ),
    },
    {
      title: "Renewals",
      dataIndex: "renewalsCount",
      key: "renewalsCount",
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ContractDto) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleView(record.id)}
            className={styles.actionButton}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            className={styles.actionButton}
          />
          <Button
            type="link"
            icon={<ReloadOutlined />}
            className={styles.actionButton}
            title="Renew Contract"
          />
          <Popconfirm
            title="Delete this contract?"
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              className={styles.actionButton}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.tableContainer}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddContract}
        >
          Add Contract
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contracts}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} contracts`,
        }}
      />

      <Modal
        title="Add Contract"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={isSubmitting}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="opportunityId"
            label="Opportunity"
            rules={[
              { required: true, message: "Please select an opportunity" },
            ]}
          >
            <Select placeholder="Select opportunity">
              {opportunities.map((o) => (
                <Select.Option key={o.id} value={o.id}>
                  {o.title || "Untitled"}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="contractValue"
            label="Contract Value"
            rules={[{ required: true, message: "Please enter contract value" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `R ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\R\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item name="currency" label="Currency" initialValue="ZAR">
            <Select>
              <Select.Option value="ZAR">
                ZAR (South African Rand)
              </Select.Option>
              <Select.Option value="USD">USD (US Dollar)</Select.Option>
              <Select.Option value="EUR">EUR (Euro)</Select.Option>
              <Select.Option value="GBP">GBP (British Pound)</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="autoRenew"
            label="Auto Renew"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ContractsTable;
