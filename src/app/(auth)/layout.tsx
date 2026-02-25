"use client";
import React from "react";
import { useStyles } from "./style/authStyles";
import { Card } from "antd";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const tabList = [
    {
      key: "login",
      tab: "Login",
    },
    {
      key: "register",
      tab: "Register",
    },
  ];

  const router = useRouter();
  const activeTabKey = usePathname().replace("/", "") || "login";
  const handleTabChange = (key: string) => {
    router.push(`/${key}`);
  };

  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <Image src="/images/logo.png" alt="Logo" width={350} height={350} />
      <Card
        activeTabKey={activeTabKey}
        tabList={tabList}
        onTabChange={handleTabChange}
      >
        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
