"use client";
import React from "react";
import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input } from "antd";
import Link from "next/link";
import { useStyles } from "../style/authStyles";
import { useAuthActions } from "@/providers/authProvider";
import { IUser } from "@/providers/authProvider/context";

type FieldType = {
  email?: string;
  password?: string;
  remember?: string;
};

const LoginPage = () => {
  const { styles } = useStyles();
  const { loginUser } = useAuthActions();

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);
    loginUser(values as IUser);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo,
  ) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <h1>Login to RocketSales</h1>
      <p>
        New here?
        <Link className={styles.link} href="/register">
          Create an account
        </Link>
      </p>
      <Form.Item<FieldType>
        label="Email"
        name="email"
        layout="vertical"
        rules={[{ required: true, message: "Please input your email!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Password"
        name="password"
        layout="vertical"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType>
        name="remember"
        valuePropName="checked"
        label={null}
      >
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item label={null}>
        <Button className={styles.button} type="primary" htmlType="submit">
          Sign in
        </Button>
      </Form.Item>

      <Link className={styles.link} href="/forgot-password">
        Forgot password?
      </Link>
    </Form>
  );
};

export default LoginPage;
