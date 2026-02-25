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
  Typography,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import {
  useContactState,
  useContactActions,
} from "@/providers/contactProvider";
import { useClientState } from "@/providers/clientProvider";
import {
  ContactDto,
  CreateContactDto,
  UpdateContactDto,
} from "@/providers/contactProvider/types";

const { Title } = Typography;
const { Option } = Select;

const ContactsPage = () => {
  const { contacts, isPending, pagination } = useContactState();
  const {
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
  } = useContactActions();
  const { clients } = useClientState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactDto | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [form] = Form.useForm();

  useEffect(() => {
    fetchContacts();
  }, []);
  useEffect(() => {
    if (selectedClientId) fetchContacts({ clientId: selectedClientId });
  }, [selectedClientId]);

  const handleAddContact = () => {
    setEditingContact(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditContact = (contact: ContactDto) => {
    setEditingContact(contact);
    form.setFieldsValue(contact);
    setIsModalVisible(true);
  };

  const handleDeleteContact = async (id: string) => {
    await deleteContact(id);
    fetchContacts();
  };

  const handleSetPrimary = async (id: string, clientId: string) => {
    await setPrimaryContact(id, clientId);
    fetchContacts({ clientId });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingContact) {
        await updateContact(editingContact.id, values as UpdateContactDto);
      } else {
        await createContact(values as CreateContactDto);
      }
      setIsModalVisible(false);
      form.resetFields();
      fetchContacts({ clientId: selectedClientId });
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      key: "fullName",
      render: (_: unknown, record: ContactDto) =>
        record.fullName || `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
      render: (text: string) => text || "N/A",
    },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    {
      title: "Primary",
      dataIndex: "isPrimaryContact",
      key: "isPrimaryContact",
      render: (isPrimary: boolean, record: ContactDto) =>
        isPrimary ? (
          <Tag color="gold">
            <StarFilled /> Primary
          </Tag>
        ) : (
          <Button
            type="link"
            icon={<StarOutlined />}
            onClick={() => handleSetPrimary(record.id, record.clientId)}
          >
            Set
          </Button>
        ),
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
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: ContactDto) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditContact(record)}
          />
          <Popconfirm
            title="Delete this contact?"
            onConfirm={() => handleDeleteContact(record.id)}
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
          <Title level={3}>Contacts</Title>
          <Space>
            <Select
              placeholder="Filter by Client"
              style={{ width: 200 }}
              allowClear
              onChange={setSelectedClientId}
            >
              {clients.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddContact}
            >
              Add Contact
            </Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={contacts}
          loading={isPending}
          rowKey="id"
          pagination={{
            current: pagination.pageNumber,
            pageSize: pagination.pageSize,
            total: pagination.totalCount,
            onChange: (page, pageSize) =>
              fetchContacts({
                pageNumber: page,
                pageSize,
                clientId: selectedClientId,
              }),
          }}
        />
        <Modal
          title={editingContact ? "Edit Contact" : "Add Contact"}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={() => setIsModalVisible(false)}
          width={500}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="clientId"
              label="Client"
              rules={[{ required: true }]}
            >
              <Select>
                <Option value="">Select Client</Option>
                {clients.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="firstName"
              label="First Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastName"
              label="Last Name"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input type="email" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone">
              <Input />
            </Form.Item>
            <Form.Item name="position" label="Position">
              <Input />
            </Form.Item>
            <Form.Item
              name="isPrimaryContact"
              label="Primary Contact"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    </div>
  );
};

export default ContactsPage;
