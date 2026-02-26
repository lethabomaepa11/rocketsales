"use client";

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Modal,
} from "antd";
import {
  OpportunityStage,
  OpportunitySource,
} from "@/providers/opportunityProvider/types";
import dayjs from "dayjs";

const { Option } = Select;

interface OpportunityFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  initialValues?: any;
  clients: any[];
  contacts: any[];
  loading?: boolean;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  clients,
  contacts,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [filteredContacts, setFilteredContacts] = useState<any[]>(contacts);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        expectedCloseDate: initialValues.expectedCloseDate
          ? dayjs(initialValues.expectedCloseDate)
          : null,
      });
      // Filter contacts based on selected client
      if (initialValues.clientId) {
        const clientContacts = contacts.filter(
          (c) => c.clientId === initialValues.clientId,
        );
        setFilteredContacts(clientContacts);
      }
    } else {
      form.resetFields();
      setFilteredContacts(contacts);
    }
  }, [initialValues, form, contacts]);

  const handleClientChange = (clientId: string) => {
    // Filter contacts based on selected client
    const clientContacts = contacts.filter((c) => c.clientId === clientId);
    setFilteredContacts(clientContacts);
    form.setFieldsValue({ contactId: undefined }); // Clear contact selection
  };

  const stageLabels: Record<OpportunityStage, string> = {
    [OpportunityStage.Lead]: "Lead",
    [OpportunityStage.Qualified]: "Qualified",
    [OpportunityStage.Proposal]: "Proposal",
    [OpportunityStage.Negotiation]: "Negotiation",
    [OpportunityStage.ClosedWon]: "Closed Won",
    [OpportunityStage.ClosedLost]: "Closed Lost",
  };

  return (
    <Modal
      title={initialValues ? "Edit Opportunity" : "Add Opportunity"}
      open={visible}
      onOk={async () => {
        try {
          const values = await form.validateFields();
          const data = {
            ...values,
            expectedCloseDate: values.expectedCloseDate?.toISOString(),
          };
          onSubmit(data);
        } catch (error) {
          console.error("Validation failed:", error);
        }
      }}
      onCancel={onCancel}
      width={600}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Form.Item
          name="clientId"
          label="Client"
          rules={[{ required: true, message: "Please select a client" }]}
        >
          <Select placeholder="Select a client" onChange={handleClientChange}>
            {clients.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="contactId" label="Contact">
          <Select
            placeholder="Select a contact"
            allowClear
            showSearch
            filterOption={(input, option) =>
              (option?.children as string)
                ?.toLowerCase()
                .includes(input.toLowerCase())
            }
          >
            {filteredContacts.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter a title" }]}
        >
          <Input placeholder="Enter opportunity title" />
        </Form.Item>
        <Form.Item name="estimatedValue" label="Value">
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter estimated value"
            min={0}
          />
        </Form.Item>
        <Form.Item name="currency" label="Currency">
          <Input placeholder="USD" />
        </Form.Item>
        <Form.Item name="probability" label="Probability (%)">
          <InputNumber
            min={0}
            max={100}
            style={{ width: "100%" }}
            placeholder="Enter probability"
          />
        </Form.Item>
        <Form.Item
          name="stage"
          label="Stage"
          rules={[{ required: true, message: "Please select a stage" }]}
        >
          <Select placeholder="Select stage">
            {Object.entries(stageLabels).map(([key, label]) => (
              <Option key={key} value={Number(key)}>
                {label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="source" label="Source">
          <Select placeholder="Select source">
            {Object.values(OpportunitySource)
              .filter((s) => typeof s === "number")
              .map((s) => (
                <Option key={s} value={s}>
                  {OpportunitySource[s]}
                </Option>
              ))}
          </Select>
        </Form.Item>
        <Form.Item name="expectedCloseDate" label="Expected Close Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} placeholder="Enter description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default OpportunityForm;
