import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Progress,
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
  OpportunityDto,
  OpportunityStage,
  OpportunitySource,
  CreateOpportunityDto,
} from "@/providers/opportunityProvider/types";
import { useOpportunityActions } from "@/providers/opportunityProvider";
import { useContactState } from "@/providers/contactProvider";
import { useRouter } from "next/navigation";
import { useStyles } from "./style/page.style";

interface OpportunitiesTableProps {
  opportunities: OpportunityDto[];
  clientId: string;
  loading: boolean;
}

const stageColors: Record<OpportunityStage, string> = {
  [OpportunityStage.Lead]: "default",
  [OpportunityStage.Qualified]: "blue",
  [OpportunityStage.Proposal]: "orange",
  [OpportunityStage.Negotiation]: "purple",
  [OpportunityStage.ClosedWon]: "green",
  [OpportunityStage.ClosedLost]: "red",
};

const stageLabels: Record<OpportunityStage, string> = {
  [OpportunityStage.Lead]: "Lead",
  [OpportunityStage.Qualified]: "Qualified",
  [OpportunityStage.Proposal]: "Proposal",
  [OpportunityStage.Negotiation]: "Negotiation",
  [OpportunityStage.ClosedWon]: "Closed Won",
  [OpportunityStage.ClosedLost]: "Closed Lost",
};

const OpportunitiesTable: React.FC<OpportunitiesTableProps> = ({
  opportunities,
  clientId,
  loading,
}) => {
  const { styles } = useStyles();
  const router = useRouter();
  const { createOpportunity, fetchOpportunities } = useOpportunityActions();
  const { contacts } = useContactState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleView = (id: string) => {
    router.push(`/opportunities?id=${id}`);
  };

  const handleAddOpportunity = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setIsSubmitting(true);
      await createOpportunity({
        ...values,
        clientId,
        estimatedValue: values.estimatedValue || 0,
        probability: values.probability || 20,
        currency: values.currency || "ZAR",
        source: values.source || OpportunitySource.Other,
      } as CreateOpportunityDto);
      message.success("Opportunity created successfully");
      setIsModalVisible(false);
      form.resetFields();
      fetchOpportunities({ clientId });
    } catch (error) {
      message.error("Failed to create opportunity");
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Contact",
      dataIndex: "contactName",
      key: "contactName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (val: number, record: OpportunityDto) =>
        `${record.currency || "R"} ${val?.toLocaleString() || 0}`,
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (prob: number) => <Progress percent={prob} size="small" />,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage: OpportunityStage, record: OpportunityDto) => (
        <Tag color={stageColors[stage]}>
          {record.stageName || stageLabels[stage] || `Stage ${stage}`}
        </Tag>
      ),
    },
    {
      title: "Owner",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (ownerName: string | null) => ownerName || "Unassigned",
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (date: string) => date || "N/A",
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
      render: (_: unknown, record: OpportunityDto) => (
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
            title="Delete this opportunity?"
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
          onClick={handleAddOpportunity}
        >
          Add Opportunity
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={opportunities}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} opportunities`,
        }}
      />

      <Modal
        title="Add Opportunity"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={isSubmitting}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter opportunity title" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="contactId" label="Contact">
            <Select placeholder="Select contact" allowClear>
              {contacts.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.fullName || `${c.firstName} ${c.lastName}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="estimatedValue"
            label="Estimated Value"
            rules={[
              { required: true, message: "Please enter estimated value" },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `R ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                value?.replace(/\R\s?|(,*)/g, "") as unknown as number
              }
            />
          </Form.Item>
          <Form.Item name="probability" label="Probability (%)">
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="source" label="Source" rules={[{ required: true }]}>
            <Select placeholder="Select source">
              <Select.Option value={OpportunitySource.Inbound}>
                Inbound
              </Select.Option>
              <Select.Option value={OpportunitySource.Outbound}>
                Outbound
              </Select.Option>
              <Select.Option value={OpportunitySource.Referral}>
                Referral
              </Select.Option>
              <Select.Option value={OpportunitySource.Partner}>
                Partner
              </Select.Option>
              <Select.Option value={OpportunitySource.Other}>
                Other
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="expectedCloseDate" label="Expected Close Date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OpportunitiesTable;
