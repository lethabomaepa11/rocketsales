"use client";

import React, { useEffect, useState } from "react";
import { Button, Image, Layout, ConfigProvider } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import SidebarMenu from "@/components/dashboards/sidebars/SidebarMenu";
import { useAuthState, useAuthActions } from "@/providers/authProvider";
import { withAuth } from "@/hoc/withAuth";
import { isDashboardRouteAllowed } from "@/utils/tenantUtils";
import { useStyles } from "./style/layout.style";
import { lightTheme, darkTheme } from "@/utils/themeConfig";

const { Content, Sider } = Layout;

const DashboardLayoutContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthState();
  const { logout } = useAuthActions();
  const { styles } = useStyles();

  // Load theme preference on mount from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setIsDarkMode(true);
    }
  }, []);

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

    if (isMobile) {
      setCollapsed(true);
    }
  };

  const handleBreakpoint = (broken: boolean) => {
    setIsMobile(broken);
    setCollapsed(broken);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  if (!user) {
    return null;
  }

  const siderClassName = `${styles.sider} ${
    isMobile ? styles.siderMobile : styles.siderDesktop
  }`;

  const mainLayoutClassName = `${styles.mainLayout} ${
    isMobile
      ? styles.mainLayoutMobile
      : collapsed
        ? styles.mainLayoutCollapsed
        : styles.mainLayoutExpanded
  }`;

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Layout className={styles.layoutRoot}>
        <Sider
          width={240}
          collapsedWidth={isMobile ? 0 : 80}
          breakpoint="lg"
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          onBreakpoint={handleBreakpoint}
          className={siderClassName}
          style={{
            background: isDarkMode ? "#141414" : undefined,
          }}
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width="100%"
            className={styles.logoImage}
            preview={false}
            style={{
              background: isDarkMode ? "#141414" : undefined,
              padding: 0,
              margin: 0,
            }}
          />
          <SidebarMenu
            collapsed={collapsed}
            selectedKeys={[pathname]}
            onMenuClick={handleMenuClick}
            userRoles={user.roles}
            userName={`${user.firstName} ${user.lastName}`.trim()}
            userEmail={user.email}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            onToggleDarkMode={handleToggleDarkMode}
          />
        </Sider>

        {isMobile && !collapsed && (
          <button
            type="button"
            className={styles.mobileBackdrop}
            onClick={() => setCollapsed(true)}
            aria-label="Close navigation"
          />
        )}

        <Layout className={mainLayoutClassName}>
          {isMobile && (
            <div className={styles.mobileTopBar}>
              <Button
                type="text"
                icon={<MenuOutlined />}
                className={styles.mobileMenuButton}
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label="Toggle navigation menu"
              />
            </div>
          )}
          <Content
            className={styles.content}
            style={{
              background: isDarkMode ? "#141414" : undefined,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

const DashboardLayout = withAuth(DashboardLayoutContent);

export default DashboardLayout;
