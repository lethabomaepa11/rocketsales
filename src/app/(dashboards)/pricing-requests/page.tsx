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
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import {
  usePricingRequestState,
  usePricingRequestActions,
} from "@/providers/pricingRequestProvider";
import {
  useOpportunityState,
  useOpportunityActions,
} from "@/providers/opportunityProvider";
import {
  PricingRequestDto,
  CreatePricingRequestDto,
  UpdatePricingRequestDto,
  PricingRequestStatus,
  Priority,
} from "@/providers/pricingRequestProvider/types";
import UserSelector from "@/components/common/UserSelector";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

const statusColors: Record<PricingRequestStatus, string> = {
  [PricingRequestStatus.Pending]: "default",
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
  [Priority.Low]: "green",
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

const PricingRequestsPage = () => {
  const { pricingRequests, isPending } = usePricingRequestState();
  const {
    fetchPricingRequests,
    createPricingRequest,
    updatePricingRequest,
    deletePricingRequest,
    completePricingRequest,
    assignPricingRequest,
  } = usePricingRequestActions();
  const { opportunities } = useOpportunityState();
  const { fetchOpportunities } = useOpportunityActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [editingRequest, setEditingRequest] =
    useState<PricingRequestDto | null>(null);
  const [assigningRequest, setAssigningRequest] =
    useState<PricingRequestDto | null>(null);
  const [form] = Form.useForm();
  const [assignForm] = Form.useForm();

  useEffect(() => {
    fetchPricingRequests();
    fetchOpportunities();
  }, []);

  const handleAddRequest = () => {
    setEditingRequest(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const handleEditRequest = (request: PricingRequestDto) => {
    setEditingRequest(request);
    form.setFieldsValue({
      ...request,
      requiredByDate: request.requiredByDate
        ? dayjs(request.requiredByDate)
        : null,
    });
    setIsModalVisible(true);
  };
  const handleDeleteRequest = async (id: string) => {
    await deletePricingRequest(id);
    fetchPricingRequests();
  };
  const handleCompleteRequest = async (id: string) => {
    await completePricingRequest(id);
    fetchPricingRequests();
  };

  const handleOpenAssignModal = (request: PricingRequestDto) => {
    setAssigningRequest(request);
    assignForm.setFieldsValue({ userId: request.assignedToId || undefined });
    setIsAssignModalVisible(true);
  };

  const handleAssignRequest = async () => {
    if (!assigningRequest) {
      return;
    }

    const values = await assignForm.validateFields();
    await assignPricingRequest(assigningRequest.id, values.userId);
    setIsAssignModalVisible(false);
    setAssigningRequest(null);
    assignForm.resetFields();
    fetchPricingRequests();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const data = {
        ...values,
        requiredByDate: values.requiredByDate?.toISOString(),
      };
      if (editingRequest) {
        await updatePricingRequest(
          editingRequest.id,
          data as UpdatePricingRequestDto,
        );
      } else {
        await createPricingRequest(data as CreatePricingRequestDto);
      }
      setIsModalVisible(false);
      fetchPricingRequests();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Request #",
      dataIndex: "requestNumber",
      key: "requestNumber",
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
      render: (text: string) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PricingRequestStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (priority: Priority) => (
        <Tag color={priorityColors[priority]}>{priorityLabels[priority]}</Tag>
      ),
    },
    {
      title: "Required By",
      dataIndex: "requiredByDate",
      key: "requiredByDate",
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedToName",
      key: "assignedToName",
      render: (text: string) => text || "Unassigned",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: PricingRequestDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditRequest(record)}
          />
          <Button
            type="link"
            icon={<TeamOutlined />}
            onClick={() => handleOpenAssignModal(record)}
          />
          {record.status !== PricingRequestStatus.Completed && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => handleCompleteRequest(record.id)}
            />
          )}
          <Popconfirm
            title="Delete this request?"
            onConfirm={() => handleDeleteRequest(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
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
          <Title level={3}>Pricing Requests</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRequest}
          >
            Add Pricing Request
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={pricingRequests}
          loading={isPending}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={
            editingRequest ? "Edit Pricing Request" : "Add Pricing Request"
          }
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="opportunityId"
              label="Opportunity"
              rules={[{ required: true }]}
            >
              <Select>
                {opportunities.map((o) => (
                  <Option key={o.id} value={o.id}>
                    {o.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="title" label="Title">
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
              <Select>
                {Object.entries(priorityLabels).map(([key, label]) => (
                  <Option key={key} value={Number(key)}>
                    {label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="requiredByDate" label="Required By">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="assignedToId" label="Assign To">
              <UserSelector
                role="SalesManager"
                isActive
                placeholder="Select assignee"
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Assign Pricing Request"
          open={isAssignModalVisible}
          onOk={handleAssignRequest}
          onCancel={() => {
            setIsAssignModalVisible(false);
            setAssigningRequest(null);
            assignForm.resetFields();
          }}
        >
          <Form form={assignForm} layout="vertical">
            <Form.Item
              name="userId"
              label="Assignee"
              rules={[{ required: true, message: "Please select an assignee" }]}
            >
              <UserSelector
                role="SalesManager"
                isActive
                allowClear={false}
                placeholder="Select pricing request assignee"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default PricingRequestsPage;
