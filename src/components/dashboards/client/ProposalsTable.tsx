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
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  ProposalDto,
  ProposalStatus,
  CreateProposalDto,
} from "@/providers/proposalProvider/types";
import { useProposalActions } from "@/providers/proposalProvider";
import { useOpportunityState } from "@/providers/opportunityProvider";
import { useRouter } from "next/navigation";
import { useStyles } from "./style/page.style";

interface ProposalsTableProps {
  proposals: ProposalDto[];
  clientId: string;
  loading: boolean;
}

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

const ProposalsTable: React.FC<ProposalsTableProps> = ({
  proposals,
  clientId,
  loading,
}) => {
  const { styles } = useStyles();
  const router = useRouter();
  const { createProposal, fetchProposals } = useProposalActions();
  const { opportunities } = useOpportunityState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleView = (id: string) => {
    router.push(`/proposals?id=${id}`);
  };

  const handleAddProposal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await createProposal({
        ...values,
        opportunityId: values.opportunityId,
        currency: values.currency || "ZAR",
        lineItems: [],
      } as CreateProposalDto);
      message.success("Proposal created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchProposals({ clientId });
    } catch (error) {
      message.error("Failed to create proposal");
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
      title: "Proposal #",
      dataIndex: "proposalNumber",
      key: "proposalNumber",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Opportunity",
      dataIndex: "opportunityTitle",
      key: "opportunityTitle",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (val: number, record: ProposalDto) =>
        `${record.currency || "R"} ${val?.toLocaleString() || 0}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ProposalStatus, record: ProposalDto) => (
        <Tag color={statusColors[status]}>
          {record.statusName || statusLabels[status] || `Status ${status}`}
        </Tag>
      ),
    },
    {
      title: "Line Items",
      dataIndex: "lineItemsCount",
      key: "lineItemsCount",
    },
    {
      title: "Valid Until",
      dataIndex: "validUntil",
      key: "validUntil",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Submitted",
      dataIndex: "submittedDate",
      key: "submittedDate",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "Not Submitted",
    },
    {
      title: "Created By",
      dataIndex: "createdByName",
      key: "createdByName",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ProposalDto) => (
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
          <Popconfirm
            title="Delete this proposal?"
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
          onClick={handleAddProposal}
        >
          Add Proposal
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={proposals}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} proposals`,
        }}
      />

      <Modal
        title="Add Proposal"
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
          <Form.Item name="validUntil" label="Valid Until">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProposalsTable;
