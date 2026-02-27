"use client";

import React, { useEffect, useState } from "react";
import { Image, Layout, Breadcrumb, Dropdown, Avatar, Space } from "antd";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenu from "@/components/dashboards/sidebars/SidebarMenu";
import { useAuthState, useAuthActions } from "@/providers/authProvider";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { withAuth } from "@/hoc/withAuth";
import { isDashboardRouteAllowed } from "@/utils/tenantUtils";
import { useStyles } from "./style/layout.style";

const { Header, Content, Sider } = Layout;

const DashboardLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { styles } = useStyles();

  useEffect(() => {
    if (!user) {
      return;
    }

    const isAllowed = isDashboardRouteAllowed(pathname, user.roles);
    if (!isAllowed) {
      router.replace("/dashboard");
    }
  }, [pathname, router, user]);

  const handleMenuClick = (key: string) => {
    router.push(key);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getBreadcrumbItems = () => {
    const pathParts = pathname.split("/").filter(Boolean);
    return pathParts.map((part, index) => ({
      key: "/" + pathParts.slice(0, index + 1).join("/"),
      title: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, " "),
    }));
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Profile" },
    { key: "settings", icon: <SettingOutlined />, label: "Settings" },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <Layout className={styles.layoutRoot}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        className={styles.sider}
      >
        <div className="demo-logo-vertical" />
        <Image
          src="/images/logo.png"
          alt="Logo"
          width="100%"
          className={styles.logoImage}
          preview={false}
        />
        <SidebarMenu
          collapsed={collapsed}
          selectedKeys={[pathname]}
          onMenuClick={handleMenuClick}
          userRoles={user.roles}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Breadcrumb
            items={getBreadcrumbItems()}
            className={styles.breadcrumb}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className={styles.userMenuTrigger}>
              <Avatar icon={<UserOutlined />} src={user.firstName?.charAt(0)} />
              <span>
                {user.firstName} {user.lastName}
              </span>
            </Space>
          </Dropdown>
        </Header>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

const DashboardLayout = withAuth(DashboardLayoutContent);

export default DashboardLayout;
