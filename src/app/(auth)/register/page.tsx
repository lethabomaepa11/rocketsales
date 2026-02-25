"use client";

import React, { useEffect } from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStyles } from "../style/authStyles";
import { useAuthActions, useAuthState } from "@/providers/authProvider";
import { IUser } from "@/providers/authProvider/context";

type FieldType = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
};

const RegisterPage = () => {
  const { styles } = useStyles();
  const { registerUser } = useAuthActions();
  const { isSuccess } = useAuthState();
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    const user: IUser = {
      userId: "",
      firstName: values.firstName || "",
      lastName: values.lastName || "",
      email: values.email || "",
      password: values.password,
    };
    registerUser(user);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (isSuccess) {
      router.push("/login");
    }
  }, [isSuccess, router]);

  return (
    <Form
      name="basic"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <h1>Join RocketSales</h1>
      <p>
        Already have an account?
        <Link className={styles.link} href="/login">
          Login
        </Link>
      </p>
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
        <Button className={styles.button} type="primary" htmlType="submit">
          Sign up
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterPage;
