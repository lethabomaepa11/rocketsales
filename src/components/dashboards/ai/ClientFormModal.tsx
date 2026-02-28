"use client";

import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { useClientActions } from "@/providers/clientProvider";
import { CreateClientDto, ClientType } from "@/providers/clientProvider/types";

interface ClientFormModalProps {
  visible: boolean;
  initialData?: Partial<CreateClientDto>;
  onClose: () => void;
  onSuccess: (client: unknown) => void;
}

const { Option } = Select;

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  visible,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { createClient } = useClientActions();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(
        initialData || {
          clientType: ClientType.Prospect,
          isActive: true,
        },
      );
    }
  }, [visible, initialData, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await createClient(values as CreateClientDto);
      onSuccess(values);
      form.resetFields();
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Create New Client"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText="Create Client"
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          clientType: ClientType.Prospect,
          isActive: true,
        }}
      >
        <Form.Item
          name="name"
          label="Client Name"
          rules={[{ required: true, message: "Please enter client name" }]}
        >
          <Input placeholder="Enter client name" />
        </Form.Item>

        <Form.Item name="industry" label="Industry">
          <Input placeholder="Enter industry" />
        </Form.Item>

        <Form.Item name="companySize" label="Company Size">
          <Select placeholder="Select company size">
            <Option value="1-10">1-10 employees</Option>
            <Option value="11-50">11-50 employees</Option>
            <Option value="51-200">51-200 employees</Option>
            <Option value="201-500">201-500 employees</Option>
            <Option value="500+">500+ employees</Option>
          </Select>
        </Form.Item>

        <Form.Item name="website" label="Website">
          <Input placeholder="https://example.com" />
        </Form.Item>

        <Form.Item name="billingAddress" label="Billing Address">
          <Input.TextArea rows={3} placeholder="Enter billing address" />
        </Form.Item>

        <Form.Item name="taxNumber" label="Tax Number">
          <Input placeholder="Enter tax number" />
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
  );
};
