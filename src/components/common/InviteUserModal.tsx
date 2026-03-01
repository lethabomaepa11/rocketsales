"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Select, Button, App, Typography } from "antd";
import { MailOutlined, UserAddOutlined } from "@ant-design/icons";
import { useAuthState } from "@/providers/authProvider";

const { Text } = Typography;

const ROLE_OPTIONS = [
  { label: "Sales Representative", value: "SalesRep" },
  { label: "Sales Manager", value: "SalesManager" },
  {
    label: "Business Development Manager",
    value: "BusinessDevelopmentManager",
  },
];

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
}

interface InviteFormValues {
  email: string;
  role: string;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm<InviteFormValues>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const { message } = App.useApp();

  const handleInvite = async (values: InviteFormValues) => {
    if (!user?.tenantId) {
      message.error("You must belong to an organization to invite users.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          tenantId: user.tenantId,
          role: values.role,
          inviterName: `${user.firstName} ${user.lastName}`.trim(),
          organizationName: user.tenantId, // Could be org name if available
        }),
      });

      const data = await response.json();

      if (response.ok) {
        message.success(`Invitation sent to ${values.email}`);
        form.resetFields();
        onClose();
      } else {
        message.error(data.error || "Failed to send invitation");
      }
    } catch {
      message.error("Failed to send invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <span>
          <UserAddOutlined style={{ marginRight: 8 }} />
          Invite Team Member
        </span>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Send an email invitation to add a new member to your organization. They
        will receive a link to register with the assigned role.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleInvite}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter an email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="colleague@company.com"
            size="large"
          />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select
            placeholder="Select a role for this user"
            options={ROLE_OPTIONS}
            size="large"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<MailOutlined />}
            block
            size="large"
          >
            Send Invitation
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default InviteUserModal;
