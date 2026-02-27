import {
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Popconfirm,
  Pagination,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  ArrowLeftOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ContactDto } from "@/providers/contactProvider/types";
import { useStyles } from "./style/ContactListView.style";

const { Title } = Typography;

interface ContactListViewProps {
  contacts: ContactDto[];
  isPending: boolean;
  selectedClientName: string;
  onBackToClients: () => void;
  onAddContact: () => void;
  onEditContact: (contact: ContactDto) => void;
  onDeleteContact: (id: string) => void;
  onSetPrimary: (id: string, clientId: string) => void;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
}

const ContactListView: React.FC<ContactListViewProps> = ({
  contacts,
  isPending,
  selectedClientName,
  onBackToClients,
  onAddContact,
  onEditContact,
  onDeleteContact,
  onSetPrimary,
  pagination,
  onPageChange,
}) => {
  const { styles } = useStyles();
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
            onClick={() => onSetPrimary(record.id, record.clientId)}
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
            onClick={() => onEditContact(record)}
          />
          <Popconfirm
            title="Delete this contact?"
            onConfirm={() => onDeleteContact(record.id)}
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
    <div>
      <div className={styles.headerRow}>
        <div>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onBackToClients}
            className={styles.backButton}
          >
            Back to Clients
          </Button>
          <Title level={3}>Contacts for {selectedClientName}</Title>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddContact}>
          Add Contact
        </Button>
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
          onChange: onPageChange,
        }}
      />
    </div>
  );
};

export default ContactListView;
