import { Table, Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ClientDto } from "@/providers/clientProvider/types";
import { useStyles } from "./style/ClientListView.style";

const { Title } = Typography;

interface ClientListViewProps {
  clients: ClientDto[];
  onAddContact: () => void;
  onViewContacts: (clientId: string) => void;
}

const ClientListView: React.FC<ClientListViewProps> = ({
  clients,
  onAddContact,
  onViewContacts,
}) => {
  const { styles } = useStyles();
  const columns = [
    {
      title: "Client Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Primary Contact",
      dataIndex: "primaryContactName",
      key: "primaryContactName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: { id: string }) => (
        <Button type="primary" onClick={() => onViewContacts(record.id)}>
          View Contacts
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className={styles.headerRow}>
        <Title level={3}>Clients</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddContact}>
          Add Contact
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={clients}
        loading={false}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ClientListView;
