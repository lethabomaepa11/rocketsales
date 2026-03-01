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
import { ClientDto, ClientType } from "@/providers/clientProvider/types";
import { useRouter } from "next/navigation";
import { useStyles } from "./style/page.style";
import { ClientFormModal } from "@/components/common/ClientFormModal";
import { useCreateEntityPrompts } from "@/hooks/useCreateEntityPrompts";

const { Title } = Typography;
const { Option } = Select;

const ClientsPage = () => {
  const { styles } = useStyles();
  const { clients, isPending, pagination } = useClientState();
  const router = useRouter();
  const { fetchClients, updateClient, deleteClient } = useClientActions();
  const { promptAfterClientCreate } = useCreateEntityPrompts();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientDto | null>(null);
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

  const handleViewClient = (client: ClientDto) => {
    router.push(`/clients/${client.id}`);
  };

  const handleViewContacts = (clientId: string) => {
    router.push(`/contacts?clientId=${clientId}`);
  };

  const handleDeleteClient = async (id: string) => {
    await deleteClient(id);
    fetchClients();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await updateClient(editingClient!.id, values);
      setIsModalVisible(false);
      form.resetFields();
      fetchClients();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleClientFormSuccess = (createdClient: ClientDto) => {
    setIsModalVisible(false);
    form.resetFields();
    fetchClients();
    // Ask user if they want to create a contact first, then opportunity
    promptAfterClientCreate(createdClient);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingClient(null);
    form.resetFields();
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
    <div className={styles.pageContainer}>
      <Card>
        <div className={styles.headerRow}>
          <Title level={3}>Clients</Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClient}
          >
            Add Client
          </Button>
        </div>

        <Space className={styles.filtersRow}>
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            className={styles.searchInput}
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

        {/* Edit Client Modal */}
        {isModalVisible && editingClient && (
          <div className="ant-modal-root">
            <div className="ant-modal-wrap">
              <div className="ant-modal">
                <div className="ant-modal-content">
                  <div className="ant-modal-header">
                    <div className="ant-modal-title">Edit Client</div>
                  </div>
                  <div className="ant-modal-body">
                    <Form form={form} layout="vertical">
                      <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                          {
                            required: true,
                            message: "Please enter client name",
                          },
                        ]}
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
                  </div>
                  <div className="ant-modal-footer">
                    <Button onClick={handleModalClose}>Cancel</Button>
                    <Button type="primary" onClick={handleModalOk}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared Client Form Modal for Create */}
        <ClientFormModal
          visible={isModalVisible && !editingClient}
          onClose={handleModalClose}
          onSuccess={handleClientFormSuccess}
        />
      </Card>
    </div>
  );
};

export default ClientsPage;
