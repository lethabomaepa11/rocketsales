"use client";

import React, { useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  AimOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  TagOutlined,
  InboxOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  AlertOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  MessageOutlined,
  BarChartOutlined,
  LineChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./Sidebar.styles";

const { Sider } = Layout;

// ─── Types ────────────────────────────────────────────────────────────────────

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: "SalesManager" | "SalesRep";
}

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  overdueCount?: number;
  expiringCount?: number;
  pendingPricingCount?: number;
  user?: User;
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Badge ────────────────────────────────────────────────────────────────────

function Badge({
  count,
  variant = "red",
  styles,
}: {
  count?: number;
  variant?: "red" | "orange";
  styles: ReturnType<typeof useSidebarStyles>["styles"];
}) {
  if (!count) return null;
  return (
    <span
      className={`${styles.badge} ${variant === "red" ? styles.badgeRed : styles.badgeOrange}`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ─── Label with optional badge ────────────────────────────────────────────────

function Label({
  text,
  count,
  variant,
  styles,
}: {
  text: string;
  count?: number;
  variant?: "red" | "orange";
  styles: ReturnType<typeof useSidebarStyles>["styles"];
}) {
  return (
    <span style={{ display: "flex", alignItems: "center" }}>
      {text}
      <Badge count={count} variant={variant} styles={styles} />
    </span>
  );
}

// ─── Section label rendered inside the scroll area ───────────────────────────

function Section({
  label,
  collapsed,
  styles,
}: {
  label: string;
  collapsed: boolean;
  styles: ReturnType<typeof useSidebarStyles>["styles"];
}) {
  if (collapsed) return <div className={styles.sectionDivider} />;
  return <div className={styles.sectionLabel}>{label}</div>;
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default function SalesManagerSidebar({
  currentPath = "/dashboard",
  onNavigate,
  overdueCount = 4,
  expiringCount = 3,
  pendingPricingCount = 7,
  user = {
    firstName: "Polane",
    lastName: "Mahloko",
    email: "polane@boxfusion.co.za",
    role: "SalesManager",
  },
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { styles } = useSidebarStyles();

  const click: MenuProps["onClick"] = ({ key }) => onNavigate?.(key);

  // Build menu items as a flat list with custom group labels interspersed.
  // We use type:'group' so section headers appear but are not selectable.
  const items: MenuProps["items"] = [
    // ── CRM ──────────────────────────────────────────────────────────────────
    {
      type: "group",
      label: <Section label="CRM" collapsed={collapsed} styles={styles} />,
      children: [
        {
          key: "/clients",
          icon: <TeamOutlined />,
          label: "Clients",
        },
        {
          key: "/contacts",
          icon: <UserOutlined />,
          label: "Contacts",
        },
      ],
    },

    // ── Sales Pipeline ────────────────────────────────────────────────────────
    {
      type: "group",
      label: (
        <Section label="Sales Pipeline" collapsed={collapsed} styles={styles} />
      ),
      children: [
        {
          key: "sub-opportunities",
          icon: <AimOutlined />,
          label: "Opportunities",
          children: [
            {
              key: "/opportunities",
              icon: <UnorderedListOutlined />,
              label: "All Opportunities",
            },
            {
              key: "/opportunities/mine",
              icon: <UserOutlined />,
              label: "My Opportunities",
            },
            {
              key: "/opportunities/pipeline",
              icon: <AppstoreOutlined />,
              label: "Pipeline View",
            },
          ],
        },
      ],
    },

    // ── Requests & Proposals ──────────────────────────────────────────────────
    {
      type: "group",
      label: (
        <Section
          label="Requests & Proposals"
          collapsed={collapsed}
          styles={styles}
        />
      ),
      children: [
        {
          key: "sub-pricing",
          icon: <TagOutlined />,
          label: (
            <Label
              text="Pricing Requests"
              count={pendingPricingCount}
              variant="orange"
              styles={styles}
            />
          ),
          children: [
            {
              key: "/pricing-requests",
              icon: <UnorderedListOutlined />,
              label: "All Requests",
            },
            {
              key: "/pricing-requests/pending",
              icon: <InboxOutlined />,
              label: (
                <Label
                  text="Pending Queue"
                  count={pendingPricingCount}
                  variant="orange"
                  styles={styles}
                />
              ),
            },
          ],
        },
        {
          key: "/proposals",
          icon: <FileTextOutlined />,
          label: "Proposals",
        },
      ],
    },

    // ── Contracts ─────────────────────────────────────────────────────────────
    {
      type: "group",
      label: (
        <Section label="Contracts" collapsed={collapsed} styles={styles} />
      ),
      children: [
        {
          key: "/contracts",
          icon: <FileDoneOutlined />,
          label: "All Contracts",
        },
        {
          key: "/contracts/expiring",
          icon: <AlertOutlined />,
          label: (
            <Label
              text="Expiring Soon"
              count={expiringCount}
              variant="red"
              styles={styles}
            />
          ),
        },
      ],
    },

    // ── Activities ────────────────────────────────────────────────────────────
    {
      type: "group",
      label: (
        <Section label="Activities" collapsed={collapsed} styles={styles} />
      ),
      children: [
        {
          key: "/activities",
          icon: <CalendarOutlined />,
          label: "All Activities",
        },
        {
          key: "/activities/mine",
          icon: <UserOutlined />,
          label: "My Activities",
        },
        {
          key: "/activities/upcoming",
          icon: <ClockCircleOutlined />,
          label: "Upcoming",
        },
        {
          key: "/activities/overdue",
          icon: <ExclamationCircleOutlined />,
          label: (
            <Label
              text="Overdue"
              count={overdueCount}
              variant="red"
              styles={styles}
            />
          ),
        },
      ],
    },

    // ── Files ─────────────────────────────────────────────────────────────────
    {
      type: "group",
      label: <Section label="Files" collapsed={collapsed} styles={styles} />,
      children: [
        {
          key: "/documents",
          icon: <PaperClipOutlined />,
          label: "Documents",
        },
        {
          key: "/notes",
          icon: <MessageOutlined />,
          label: "Notes",
        },
      ],
    },

    // ── Reports ───────────────────────────────────────────────────────────────
    {
      type: "group",
      label: <Section label="Reports" collapsed={collapsed} styles={styles} />,
      children: [
        {
          key: "/reports/opportunities",
          icon: <BarChartOutlined />,
          label: "Opportunities",
        },
        {
          key: "/reports/sales-by-period",
          icon: <LineChartOutlined />,
          label: "Sales by Period",
        },
      ],
    },
  ];

  return (
    <>
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        onClick={click}
        className={styles.menu}
        inlineCollapsed={collapsed}
        style={{ marginTop: 8, flexShrink: 0 }}
        items={[
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: "Dashboard",
          },
        ]}
      />

      {/* ── Scrollable grouped menu ── */}
      <div className={styles.scrollArea}>
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          defaultOpenKeys={["sub-opportunities", "sub-pricing"]}
          onClick={click}
          className={styles.menu}
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>

      {/* ── User footer ── */}
      <div className={styles.userWrap}>
        {collapsed ? (
          <Tooltip
            placement="right"
            title={
              <>
                <div style={{ fontWeight: 600, fontSize: 12 }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>
                  {user.role === "SalesManager" ? "Sales Manager" : "Sales Rep"}
                </div>
              </>
            }
          >
            <div className={`${styles.userRow} ${styles.userRowCollapsed}`}>
              <div className={styles.avatar}>
                {initials(user.firstName, user.lastName)}
              </div>
            </div>
          </Tooltip>
        ) : (
          <div className={styles.userRow}>
            <div className={styles.avatar}>
              {initials(user.firstName, user.lastName)}
            </div>
            <div className={styles.userMeta}>
              <div className={styles.userNameText}>
                {user.firstName} {user.lastName}
              </div>
              <div className={styles.userRoleRow}>
                <span className={styles.roleDot} />
                <span className={styles.roleText}>
                  {user.role === "SalesManager" ? "Sales Manager" : "Sales Rep"}
                </span>
              </div>
            </div>
            <Tooltip title="Settings">
              <SettingOutlined className={styles.settingsIcon} />
            </Tooltip>
          </div>
        )}
      </div>
    </>
  );
}
