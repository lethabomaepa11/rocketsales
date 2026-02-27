"use client";

import { Menu } from "antd";
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
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed = false,
  selectedKeys = ["/dashboard"],
  onMenuClick,
  userRoles,
}) => {
  const { styles } = useStyles();
  const handleMenuClick: MenuProps["onClick"] = ({ key }) => {
    onMenuClick?.(key);
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

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKeys}
      onClick={handleMenuClick}
      className={styles.menu}
      items={visibleMenuItems}
      inlineCollapsed={collapsed}
    />
  );
};

export default SidebarMenu;
