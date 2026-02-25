"use client";

import { Menu } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  AimOutlined,
  TagOutlined,
  FileDoneOutlined,
  AlertOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  MessageOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import type { MenuProps } from "antd";

interface SidebarMenuProps {
  collapsed?: boolean;
  selectedKeys?: string[];
  onMenuClick?: (key: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  collapsed = false,
  selectedKeys = ["/dashboard"],
  onMenuClick,
}) => {
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
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKeys}
      onClick={handleMenuClick}
      style={{ background: "transparent", border: "none" }}
      items={menuItems}
      inlineCollapsed={collapsed}
    />
  );
};

export default SidebarMenu;
