"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import type { FormProps } from "antd";
import { Button, Col, Form, Input, Row, Spin, Tag, Typography } from "antd";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStyles as useAuthStyles } from "../style/authStyles";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  tenantName?: string;
};

interface InviteData {
  tenantId: string;
  role: string;
  email: string;
}

const ROLE_LABELS: Record<string, string> = {
  SalesRep: "Sales Representative",
  SalesManager: "Sales Manager",
  BusinessDevelopmentManager: "Business Development Manager",
  Admin: "Administrator",
};

const RegisterForm = () => {
  const { styles: authStyles } = useAuthStyles();
  const { registerUser } = useAuthActions();
  const { isSuccess } = useAuthState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form] = Form.useForm<FieldType>();

  // Decode invitation token from URL
  const inviteData = useMemo<InviteData | null>(() => {
    const token = searchParams.get("token");
    if (!token) return null;
    try {
      const decoded = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
      const data = JSON.parse(decoded) as InviteData;
      if (data.tenantId && data.role && data.email) {
        return data;
      }
    } catch {
      console.error("Invalid invitation token");
    }
    return null;
  }, [searchParams]);

  const hasInvite = !!inviteData;

  // Set the email field when invite data is available
  useEffect(() => {
    if (inviteData?.email) {
      form.setFieldsValue({ email: inviteData.email });
    }
  }, [inviteData, form]);

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const payload: Record<string, string | undefined> = {
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      email: values.email || "",
      password: values.password,
      phoneNumber: values.phoneNumber,
    };

    if (hasInvite && inviteData) {
      // Invited user — join the org with the assigned role
      payload.tenantId = inviteData.tenantId;
      payload.role = inviteData.role;
    } else if (values.tenantName) {
      // New org
      payload.tenantName = values.tenantName;
    }
    // Otherwise: default workspace

    registerUser(payload);
  };

  useEffect(() => {
    if (isSuccess) {
      if (typeof window !== "undefined") {
        location.reload();
      }
    }
  }, [isSuccess, router]);

  return (
    <Form
      name="register"
      layout="vertical"
      onFinish={onFinish}
      autoComplete="off"
      form={form}
      size="middle"
      requiredMark={false}
      style={{ maxWidth: 480 }}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: "0 0 4px" }}>
          {hasInvite ? "Accept Invitation" : "Join RocketSales"}
        </h2>
        <Text type="secondary">
          Already have an account?{" "}
          <Link className={authStyles.link} href="/login">
            Login
          </Link>
        </Text>
      </div>

      {/* Invitation Banner */}
      {hasInvite && inviteData && (
        <div
          style={{
            background: "linear-gradient(135deg, #e6f4ff 0%, #f0f5ff 100%)",
            border: "1px solid #91caff",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 16,
          }}
        >
          <Text strong>
            <TeamOutlined style={{ marginRight: 6 }} />
            You&apos;ve been invited to join an organization
          </Text>
          <div style={{ marginTop: 4 }}>
            <Tag color="blue">
              {ROLE_LABELS[inviteData.role] || inviteData.role}
            </Tag>
          </div>
        </div>
      )}

      {/* Org name field — only for non-invited users */}
      {!hasInvite && (
        <Form.Item<FieldType>
          label="Organisation Name"
          name="tenantName"
          tooltip="Leave blank to use the default shared workspace"
        >
          <Input
            prefix={<TeamOutlined />}
            placeholder="e.g., Acme Corp (optional)"
          />
        </Form.Item>
      )}

      {/* Name Fields */}
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item<FieldType>
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="First name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<FieldType>
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Last name" />
          </Form.Item>
        </Col>
      </Row>

      {/* Email & Phone */}
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Required" },
              { type: "email", message: "Invalid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="you@email.com"
              disabled={hasInvite}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<FieldType> label="Phone" name="phoneNumber">
            <Input prefix={<PhoneOutlined />} placeholder="Optional" />
          </Form.Item>
        </Col>
      </Row>

      {/* Password Fields */}
      <Row gutter={12}>
        <Col span={12}>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Required" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item<FieldType>
            label="Confirm Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Required" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords don't match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
        <Button className={authStyles.button} type="primary" htmlType="submit">
          {hasInvite ? "Accept & Sign Up" : "Sign Up"}
        </Button>
      </Form.Item>
    </Form>
  );
};

const RegisterPage = () => {
  return (
    <Suspense
      fallback={
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
};

export default RegisterPage;
