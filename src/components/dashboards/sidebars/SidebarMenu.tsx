"use client";

import { Menu, Dropdown, Avatar, Typography, Switch } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  AimOutlined,
  TagOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  isSalesRepRole,
  SALES_REP_ALLOWED_DASHBOARD_ROUTES,
} from "@/utils/tenantUtils";
import type { MenuProps } from "antd";
import { useStyles } from "./style/SidebarMenu.style";

interface SidebarMenuProps {
  collapsed?: boolean;
  selectedKeys?: string[];
  onMenuClick?: (key: string) => void;
  userRoles?: string[];
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: (checked: boolean) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed = false,
  selectedKeys = ["/dashboard"],
  onMenuClick,
  userRoles,
  userName,
  userEmail,
  onLogout,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const { styles } = useStyles();
  const displayName = userName?.trim() || "User";
  const displayEmail = userEmail || "Account";

  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    onMenuClick?.(key);
  };

  const handleProfileMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      onLogout?.();
      return;
    }
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },

    {
      key: "/clients",
      icon: <TeamOutlined />,
      label: "Clients",
    },
    {
      key: "/opportunities",
      icon: <AimOutlined />,
      label: "Opportunities",
    },

    {
      key: "/pricing-requests",
      icon: <TagOutlined />,
      label: "Pricing Requests",
    },
    {
      key: "/proposals",
      icon: <FileTextOutlined />,
      label: "Proposals",
    },

    {
      key: "/contracts",
      icon: <FileDoneOutlined />,
      label: "Contracts",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
  ];

  // Add settings for non-sales rep users (managers/admins)
  const adminMenuItems: MenuProps["items"] = [
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
  ];

  const allowedSalesRepRoutes = new Set<string>(
    SALES_REP_ALLOWED_DASHBOARD_ROUTES,
  );

  const visibleMenuItems = isSalesRepRole(userRoles)
    ? menuItems.filter((item) => {
        const key = item?.key;
        return typeof key === "string" && allowedSalesRepRoutes.has(key);
      })
    : [...menuItems, ...adminMenuItems];

  const profileMenuItems: MenuProps["items"] = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
    },
  ];

  return (
    <div className={styles.container}>
      <Menu
        mode="inline"
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
        className={styles.menu}
        items={visibleMenuItems}
        inlineCollapsed={collapsed}
        style={{
          background: isDarkMode ? "#141414" : undefined,
        }}
      />

      <div className={styles.profileSection}>
        {!collapsed && (
          <div className={styles.themeToggle}>
            <SunOutlined className={styles.themeIcon} />
            <Switch
              checked={isDarkMode}
              onChange={onToggleDarkMode}
              size="small"
            />
            <MoonOutlined className={styles.themeIcon} />
          </div>
        )}

        <Dropdown
          menu={{ items: profileMenuItems, onClick: handleProfileMenuClick }}
          placement="topRight"
          trigger={["click"]}
        >
          <button
            type="button"
            className={`${styles.profileTrigger} ${
              collapsed ? styles.profileTriggerCollapsed : ""
            }`}
          >
            <Avatar icon={<UserOutlined />}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>

            {!collapsed && (
              <>
                <span className={styles.profileMeta}>
                  <Typography.Text className={styles.profileName}>
                    {displayName}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    className={styles.profileEmail}
                  >
                    {displayEmail}
                  </Typography.Text>
                </span>
                <DownOutlined className={styles.profileChevron} />
              </>
            )}
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default SidebarMenu;
