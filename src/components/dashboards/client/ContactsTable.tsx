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
  Switch,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ContactDto,
  CreateContactDto,
} from "@/providers/contactProvider/types";
import { useContactActions } from "@/providers/contactProvider";
import { useStyles } from "./style/page.style";

interface ContactsTableProps {
  contacts: ContactDto[];
  clientId: string;
  loading: boolean;
}

const ContactsTable: React.FC<ContactsTableProps> = ({
  contacts,
  clientId,
  loading,
}) => {
  const { styles } = useStyles();
  const {
    setPrimaryContact,
    deleteContact,
    fetchContactsByClient,
    createContact,
  } = useContactActions();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSetPrimary = async (id: string) => {
    await setPrimaryContact(id, clientId);
    fetchContactsByClient(clientId);
  };

  const handleDelete = async (id: string) => {
    await deleteContact(id);
    fetchContactsByClient(clientId);
  };

  const handleAddContact = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await createContact({
        ...values,
        clientId,
      } as CreateContactDto);
      message.success("Contact created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchContactsByClient(clientId);
    } catch (error) {
      console.error("Failed to create contact:", error);
      message.error("Failed to create contact");
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
      title: "Name",
      key: "fullName",
      render: (_: unknown, record: ContactDto) =>
        record.fullName ||
        `${record.firstName || ""} ${record.lastName || ""}`.trim() ||
        "N/A",
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
            onClick={() => handleSetPrimary(record.id)}
            className={styles.actionButton}
          >
            Set Primary
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
            className={styles.actionButton}
          />
          <Popconfirm
            title="Delete this contact?"
            onConfirm={() => handleDelete(record.id)}
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
          onClick={handleAddContact}
        >
          Add Contact
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contacts}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} contacts`,
        }}
      />

      <Modal
        title="Add Contact"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={isSubmitting}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Please enter a valid email" }]}
          >
            <Input />
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
    </div>
  );
};

export default ContactsTable;
