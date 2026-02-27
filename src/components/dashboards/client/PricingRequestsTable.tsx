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
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  PricingRequestDto,
  PricingRequestStatus,
  Priority,
  CreatePricingRequestDto,
} from "@/providers/pricingRequestProvider/types";
import { usePricingRequestActions } from "@/providers/pricingRequestProvider";
import { useOpportunityState } from "@/providers/opportunityProvider";
import { useRouter } from "next/navigation";
import { useStyles } from "./style/page.style";

interface PricingRequestsTableProps {
  pricingRequests: PricingRequestDto[];
  clientId: string;
  loading: boolean;
}

const statusColors: Record<PricingRequestStatus, string> = {
  [PricingRequestStatus.Pending]: "orange",
  [PricingRequestStatus.InProgress]: "blue",
  [PricingRequestStatus.Completed]: "green",
  [PricingRequestStatus.Cancelled]: "red",
};

const statusLabels: Record<PricingRequestStatus, string> = {
  [PricingRequestStatus.Pending]: "Pending",
  [PricingRequestStatus.InProgress]: "In Progress",
  [PricingRequestStatus.Completed]: "Completed",
  [PricingRequestStatus.Cancelled]: "Cancelled",
};

const priorityColors: Record<Priority, string> = {
  [Priority.Low]: "default",
  [Priority.Medium]: "blue",
  [Priority.High]: "orange",
  [Priority.Urgent]: "red",
};

const priorityLabels: Record<Priority, string> = {
  [Priority.Low]: "Low",
  [Priority.Medium]: "Medium",
  [Priority.High]: "High",
  [Priority.Urgent]: "Urgent",
};

const PricingRequestsTable: React.FC<PricingRequestsTableProps> = ({
  pricingRequests,
  clientId,
  loading,
}) => {
  const { styles } = useStyles();
  const router = useRouter();
  const { createPricingRequest, fetchPricingRequests } =
    usePricingRequestActions();
  const { opportunities } = useOpportunityState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleView = (id: string) => {
    router.push(`/pricing-requests?id=${id}`);
  };

  const handleAddPricingRequest = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await createPricingRequest({
        ...values,
        opportunityId: values.opportunityId,
        priority: values.priority || Priority.Medium,
      } as CreatePricingRequestDto);
      message.success("Pricing request created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchPricingRequests();
    } catch (error) {
      console.error("Failed to create pricing request:", error);
      message.error("Failed to create pricing request");
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
      title: "Request #",
      dataIndex: "requestNumber",
      key: "requestNumber",
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PricingRequestStatus, record: PricingRequestDto) => (
        <Tag color={statusColors[status]}>
          {record.statusName || statusLabels[status] || `Status ${status}`}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Priority, record: PricingRequestDto) => (
        <Tag color={priorityColors[priority]}>
          {record.priorityName ||
            priorityLabels[priority] ||
            `Priority ${priority}`}
        </Tag>
      ),
    },
    {
      title: "Requested By",
      dataIndex: "requestedByName",
      key: "requestedByName",
      render: (text: string | null) => text || "N/A",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      render: (text: string | null) => text || "Unassigned",
    },
    {
      title: "Required By",
      dataIndex: "requiredByDate",
      key: "requiredByDate",
      render: (date: string | null) =>
        date ? new Date(date).toLocaleDateString() : "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: PricingRequestDto) => (
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
            title="Delete this pricing request?"
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
          onClick={handleAddPricingRequest}
        >
          Add Pricing Request
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={pricingRequests}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} pricing requests`,
        }}
      />

      <Modal
        title="Add Pricing Request"
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
            name="priority"
            label="Priority"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select priority">
              <Select.Option value={Priority.Low}>Low</Select.Option>
              <Select.Option value={Priority.Medium}>Medium</Select.Option>
              <Select.Option value={Priority.High}>High</Select.Option>
              <Select.Option value={Priority.Urgent}>Urgent</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="requiredByDate" label="Required By Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PricingRequestsTable;
