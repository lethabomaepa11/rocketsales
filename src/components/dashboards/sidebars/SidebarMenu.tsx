"use client";

import { Menu, Dropdown, Avatar, Typography } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  AimOutlined,
  TagOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  MessageOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  DownOutlined,
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
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed = false,
  selectedKeys = ["/dashboard"],
  onMenuClick,
  userRoles,
  userName,
  userEmail,
  onLogout,
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
      key: "/activities",
      icon: <CalendarOutlined />,
      label: "Activities",
    },
    {
      key: "/notes",
      icon: <MessageOutlined />,
      label: "Notes",
    },
    {
      key: "/documents",
      icon: <PaperClipOutlined />,
      label: "Documents",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
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
    : menuItems;

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
      />

      <div className={styles.profileSection}>
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
