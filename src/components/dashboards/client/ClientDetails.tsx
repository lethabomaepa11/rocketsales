import { Card, Tag, Typography, Descriptions } from "antd";
import { ClientDto, ClientType } from "@/providers/clientProvider/types";
import { useStyles } from "./style/page.style";

const { Title } = Typography;

interface ClientDetailsProps {
  client: ClientDto;
}

const ClientDetails: React.FC<ClientDetailsProps> = ({ client }) => {
  const { styles } = useStyles();

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

  return (
    <div className={styles.detailsContainer}>
      <Card title="Basic Information">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Name">
            {client.name || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Industry">
            {client.industry || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Company Size">
            {client.companySize || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Client Type">
            {getClientTypeTag(client.clientType)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={client.isActive ? "green" : "red"}>
              {client.isActive ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Contact Information">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Website">
            {client.website ? (
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                {client.website}
              </a>
            ) : (
              "N/A"
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tax Number">
            {client.taxNumber || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Address">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Billing Address">
            {client.billingAddress || "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Statistics">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Contacts">
            {client.contactsCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Opportunities">
            {client.opportunitiesCount || 0}
          </Descriptions.Item>
          <Descriptions.Item label="Contracts">
            {client.contractsCount || 0}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="System Information">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Created By">
            {client.createdByName || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {client.createdAt
              ? new Date(client.createdAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {client.updatedAt
              ? new Date(client.updatedAt).toLocaleString()
              : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ClientDetails;
