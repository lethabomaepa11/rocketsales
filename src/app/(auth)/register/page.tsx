"use client";

import React, { useEffect, useState } from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Tabs, Select } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStyles as useAuthStyles } from "../style/authStyles";
import { useStyles } from "./style/page.style";
import { useAuthActions, useAuthState } from "@/providers/authProvider";

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  tenantName?: string;
  tenantId?: string;
  role?: string;
};

type ScenarioType = "new-org" | "join-org" | "default";

const ROLE_OPTIONS = [
  { label: "Sales Representative", value: "SalesRep" },
  { label: "Sales Manager", value: "SalesManager" },
  {
    label: "Business Development Manager",
    value: "BusinessDevelopmentManager",
  },
];

const RegisterPage = () => {
  const { styles: authStyles } = useAuthStyles();
  const { styles } = useStyles();
  const { registerUser } = useAuthActions();
  const { isSuccess } = useAuthState();
  const router = useRouter();
  const [scenario, setScenario] = useState<ScenarioType>("default");
  const [form] = Form.useForm<FieldType>();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    // Build payload based on selected scenario
    const payload: Record<string, string | undefined> = {
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      email: values.email || "",
      password: values.password,
      phoneNumber: values.phoneNumber,
    };

    // Scenario A: Create new organisation
    if (scenario === "new-org" && values.tenantName) {
      payload.tenantName = values.tenantName;
    }
    // Scenario B: Join existing organisation
    else if (scenario === "join-org" && values.tenantId) {
      payload.tenantId = values.tenantId;
      if (values.role) {
        payload.role = values.role;
      }
    }
    // Scenario C: Use default shared tenant (no additional fields needed)

    registerUser(payload);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (isSuccess) {
      if (typeof window !== "undefined") {
        // Force reload to ensure auth state is fully updated across the app
        location.reload();
      }
    }
  }, [isSuccess, router]);

  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      form={form}
    >
      <h1>Join RocketSales</h1>
      <p>
        Already have an account?
        <Link className={authStyles.link} href="/login">
          Login
        </Link>
      </p>

      {/* Organisation Setup Options */}
      <Form.Item label="Organisation Setup">
        <Tabs
          activeKey={scenario}
          onChange={(key) => {
            setScenario(key as ScenarioType);
            form.resetFields(["tenantName", "tenantId", "role"]);
          }}
          items={[
            {
              key: "new-org",
              label: "Create New Organisation",
              children: (
                <Form.Item<FieldType>
                  label="Organisation Name"
                  name="tenantName"
                  rules={[
                    {
                      required: scenario === "new-org",
                      message: "Please input your organisation name!",
                    },
                  ]}
                >
                  <Input placeholder="e.g., Acme Corp" />
                </Form.Item>
              ),
            },
            {
              key: "join-org",
              label: "Join Existing Organisation",
              children: (
                <>
                  <Form.Item<FieldType>
                    label="Organisation ID"
                    name="tenantId"
                    rules={[
                      {
                        required: scenario === "join-org",
                        message: "Please input the organisation ID!",
                      },
                    ]}
                  >
                    <Input placeholder="Paste the tenant ID from your admin" />
                  </Form.Item>
                  <Form.Item<FieldType> label="Role (optional)" name="role">
                    <Select
                      placeholder="Select your role"
                      options={ROLE_OPTIONS}
                      allowClear
                    />
                  </Form.Item>
                </>
              ),
            },
            {
              key: "default",
              label: "Use Default Workspace",
              children: (
                <p className={styles.defaultWorkspaceText}>
                  You will be added to the shared demo workspace.
                </p>
              ),
            },
          ]}
        />
      </Form.Item>

      {/* Common User Fields */}
      <Flex>
        <Form.Item<FieldType>
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
      </Flex>

      <Form.Item<FieldType>
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your email!",
            type: "email",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType> label="Phone Number" name="phoneNumber">
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        label="Confirm Password"
        name="confirmPassword"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Please confirm your password!" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Passwords do not match!"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button className={authStyles.button} type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
