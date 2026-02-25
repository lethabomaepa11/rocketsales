"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Select,
  Card,
  Modal,
  Form,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useClientState, useClientActions } from "@/providers/clientProvider";
import {
  ClientDto,
  ClientType,
  CreateClientDto,
} from "@/providers/clientProvider/types";

const { Title } = Typography;
const { Option } = Select;

const ClientsPage = () => {
  const { clients, isPending, pagination } = useClientState();
  const {
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    fetchClientStats,
  } = useClientActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDto | null>(null);
  const [viewingClient, setViewingClient] = useState<ClientDto | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearch = () => {
    fetchClients({ searchTerm, pageNumber: 1, pageSize: 10 });
  };

  const handleAddClient = () => {
    setEditingClient(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditClient = (client: ClientDto) => {
    setEditingClient(client);
    form.setFieldsValue(client);
    setIsModalVisible(true);
  };

  const handleViewClient = async (client: ClientDto) => {
    setViewingClient(client);
    await fetchClientStats(client.id);
    setIsViewModalVisible(true);
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
    fetchClients();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingClient) {
        await updateClient(editingClient.id, values);
      } else {
        await createClient(values as CreateClientDto);
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const getClientTypeTag = (type: ClientType) => {
    const colors: Record<ClientType, string> = {
      [ClientType.Prospect]: "blue",
      [ClientType.Customer]: "green",
      [ClientType.Partner]: "purple",
    };
    const labels: Record<ClientType, string> = {
      [ClientType.Prospect]: "Prospect",
      [ClientType.Customer]: "Customer",
      [ClientType.Partner]: "Partner",
    };
    return <Tag color={colors[type]}>{labels[type]}</Tag>;
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Industry",
      dataIndex: "industry",
      key: "industry",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Company Size",
      dataIndex: "companySize",
      key: "companySize",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Type",
      dataIndex: "clientType",
      key: "clientType",
      render: (type: ClientType) => getClientTypeTag(type),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Contacts",
      dataIndex: "contactsCount",
      key: "contactsCount",
    },
    {
      title: "Opportunities",
      dataIndex: "opportunitiesCount",
      key: "opportunitiesCount",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ClientDto) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewClient(record)}
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditClient(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this client?"
            onConfirm={() => handleDeleteClient(record.id)}
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
          <Title level={3}>Clients</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        </div>

        <Space style={{ marginBottom: 16 }}>
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={clients}
          loading={isPending}
          rowKey="id"
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.totalCount,
            onChange: (page, pageSize) => {
              fetchClients({ pageNumber: page, pageSize, searchTerm });
            },
          }}
        />

        <Modal
          title={editingClient ? "Edit Client" : "Add Client"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter client name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="industry" label="Industry">
              <Input />
            </Form.Item>
            <Form.Item name="companySize" label="Company Size">
              <Input />
            </Form.Item>
            <Form.Item name="website" label="Website">
              <Input />
            </Form.Item>
            <Form.Item name="billingAddress" label="Billing Address">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="taxNumber" label="Tax Number">
              <Input />
            </Form.Item>
            <Form.Item
              name="clientType"
              label="Client Type"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value={ClientType.Prospect}>Prospect</Option>
                <Option value={ClientType.Customer}>Customer</Option>
                <Option value={ClientType.Partner}>Partner</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title="Client Details"
          open={isViewModalVisible}
          onCancel={() => setIsViewModalVisible(false)}
          footer={null}
          width={600}
        >
          {viewingClient && (
            <div>
              <p>
                <strong>Name:</strong> {viewingClient.name}
              </p>
              <p>
                <strong>Industry:</strong> {viewingClient.industry}
              </p>
              <p>
                <strong>Company Size:</strong> {viewingClient.companySize}
              </p>
              <p>
                <strong>Website:</strong> {viewingClient.website}
              </p>
              <p>
                <strong>Billing Address:</strong> {viewingClient.billingAddress}
              </p>
              <p>
                <strong>Tax Number:</strong> {viewingClient.taxNumber}
              </p>
            </div>
          )}
        </Modal>
      </Card>
    </div>
  );
};

export default ClientsPage;
