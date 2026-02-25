'use client';

import React, { useState } from 'react';
import { Layout, Menu, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  AimOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  TagOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PaperClipOutlined,
  MessageOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';

// ─── Rep-specific styles (blue accent instead of orange) ──────────────────────

const useRepStyles = createStyles(({ css }) => ({

  sider: css`
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #0b0f1a !important;
    border-right: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    flex-direction: column;

    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .ant-layout-sider-trigger {
      background: #0d1120 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.3);
      font-size: 13px;
      transition: color 0.2s ease;

      &:hover {
        color: rgba(255, 255, 255, 0.75);
      }
    }
  `,

  logoWrap: css`
    padding: 18px 16px 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  `,

  logoInner: css`
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  `,

  logoInnerCollapsed: css`
    justify-content: center;
  `,

  logoMark: css`
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 9px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    box-shadow: 0 0 18px rgba(59, 130, 246, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    font-family: 'Georgia', 'Times New Roman', serif;
    flex-shrink: 0;
  `,

  logoTextGroup: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  logoTitle: css`
    font-size: 13.5px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.2px;
  `,

  logoSub: css`
    font-size: 9.5px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.28);
    white-space: nowrap;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    line-height: 1;
  `,

  scrollArea: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 8px;

    &::-webkit-scrollbar { width: 3px; }
    &::-webkit-scrollbar-track { background: transparent; }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
    }
  `,

  sectionLabel: css`
    padding: 16px 16px 5px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.18);
    white-space: nowrap;
    user-select: none;
    line-height: 1;
  `,

  sectionDivider: css`
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 10px 14px;
  `,

  menu: css`
    background: transparent !important;
    border-inline-end: none !important;
    padding: 0 8px;

    .ant-menu-item,
    .ant-menu-submenu-title {
      border-radius: 8px !important;
      margin-block: 2px !important;
      color: rgba(255, 255, 255, 0.48) !important;
      font-size: 13px !important;
      height: 38px !important;
      line-height: 38px !important;
      transition: background 0.15s ease, color 0.15s ease !important;

      &:hover {
        background: rgba(255, 255, 255, 0.06) !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }

      .ant-menu-item-icon {
        font-size: 15px !important;
        opacity: 0.7;
        transition: opacity 0.15s;
      }

      &:hover .ant-menu-item-icon { opacity: 1; }
    }

    /* Selected — blue accent for rep */
    .ant-menu-item-selected {
      background: rgba(59, 130, 246, 0.14) !important;
      color: #60a5fa !important;
      font-weight: 600 !important;

      .ant-menu-item-icon {
        opacity: 1;
        color: #60a5fa !important;
      }

      &::after {
        border-inline-end: 3px solid #3b82f6 !important;
        inset-inline-end: 0 !important;
        border-radius: 3px 0 0 3px !important;
      }
    }

    .ant-menu-submenu-selected > .ant-menu-submenu-title {
      color: #60a5fa !important;
      .ant-menu-item-icon { color: #60a5fa !important; opacity: 1; }
    }

    .ant-menu-submenu-arrow {
      color: rgba(255, 255, 255, 0.2) !important;
      transition: color 0.15s !important;
    }

    .ant-menu-submenu:hover > .ant-menu-submenu-title .ant-menu-submenu-arrow,
    .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow {
      color: rgba(255, 255, 255, 0.45) !important;
    }

    .ant-menu-sub.ant-menu-inline { background: transparent !important; }

    .ant-menu-sub .ant-menu-item {
      height: 35px !important;
      line-height: 35px !important;
      font-size: 12.5px !important;
      color: rgba(255, 255, 255, 0.38) !important;
      border-radius: 7px !important;
      margin-block: 1px !important;

      &:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        color: rgba(255, 255, 255, 0.8) !important;
      }

      &.ant-menu-item-selected {
        background: rgba(59, 130, 246, 0.12) !important;
        color: #60a5fa !important;
        font-weight: 600 !important;

        &::after {
          border-inline-end: 3px solid #3b82f6 !important;
          inset-inline-end: 0 !important;
          border-radius: 3px 0 0 3px !important;
        }
      }
    }
  `,

  userWrap: css`
    flex-shrink: 0;
    padding: 10px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.18);
  `,

  userRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.15s ease;
    &:hover { background: rgba(255, 255, 255, 0.06); }
  `,

  userRowCollapsed: css`
    justify-content: center;
  `,

  avatar: css`
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    font-family: 'Georgia', serif;
  `,

  userMeta: css`
    overflow: hidden;
    flex: 1;
    min-width: 0;
  `,

  userNameText: css`
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  `,

  userRoleRow: css`
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  `,

  roleDot: css`
    width: 5px;
    height: 5px;
    min-width: 5px;
    border-radius: 50%;
    background: #3b82f6;
  `,

  roleText: css`
    font-size: 10.5px;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
  `,

  settingsIcon: css`
    font-size: 14px;
    color: rgba(255, 255, 255, 0.22);
    flex-shrink: 0;
    cursor: pointer;
    transition: color 0.15s;
    &:hover { color: rgba(255, 255, 255, 0.65); }
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    padding: 0 5px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    margin-left: 6px;
    flex-shrink: 0;
    background: rgba(239, 68, 68, 0.18);
    color: #f87171;
  `,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(f: string, l: string) {
  return `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase();
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SalesRepSidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
  overdueCount?: number;
  user?: { firstName: string; lastName: string; email: string };
}

export default function SalesRepSidebar({
  currentPath = '/dashboard',
  onNavigate,
  overdueCount = 2,
  user = { firstName: 'Thabo', lastName: 'Nkosi', email: 'thabo@boxfusion.co.za' },
}: SalesRepSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { styles } = useRepStyles();

  const click: MenuProps['onClick'] = ({ key }) => onNavigate?.(key);

  function Section({ label }: { label: string }) {
    if (collapsed) return <div className={styles.sectionDivider} />;
    return <div className={styles.sectionLabel}>{label}</div>;
  }

  const items: MenuProps['items'] = [

    // ── CRM ──
    {
      type: 'group',
      label: <Section label="CRM" />,
      children: [
        { key: '/clients',  icon: <TeamOutlined />,  label: 'Clients'  },
        { key: '/contacts', icon: <UserOutlined />,  label: 'Contacts' },
      ],
    },

    // ── My Pipeline ──
    {
      type: 'group',
      label: <Section label="My Pipeline" />,
      children: [
        {
          key: 'sub-opp',
          icon: <AimOutlined />,
          label: 'Opportunities',
          children: [
            { key: '/opportunities/mine',     icon: <UserOutlined />,         label: 'My Opportunities' },
            { key: '/opportunities/pipeline', icon: <AppstoreOutlined />,     label: 'Pipeline View'    },
            { key: '/opportunities',          icon: <UnorderedListOutlined />, label: 'All Opportunities' },
          ],
        },
      ],
    },

    // ── Requests & Proposals ──
    {
      type: 'group',
      label: <Section label="Requests & Proposals" />,
      children: [
        { key: '/pricing-requests', icon: <TagOutlined />,      label: 'My Pricing Requests' },
        { key: '/proposals',        icon: <FileTextOutlined />, label: 'Proposals'            },
      ],
    },

    // ── Contracts ──
    {
      type: 'group',
      label: <Section label="Contracts" />,
      children: [
        { key: '/contracts', icon: <FileDoneOutlined />, label: 'Contracts' },
      ],
    },

    // ── Activities ──
    {
      type: 'group',
      label: <Section label="Activities" />,
      children: [
        { key: '/activities/mine',     icon: <CalendarOutlined />,          label: 'My Activities' },
        { key: '/activities/upcoming', icon: <ClockCircleOutlined />,       label: 'Upcoming'      },
        {
          key: '/activities/overdue',
          icon: <ExclamationCircleOutlined />,
          label: (
            <span style={{ display: 'flex', alignItems: 'center' }}>
              Overdue
              {!!overdueCount && (
                <span className={styles.badge}>
                  {overdueCount > 99 ? '99+' : overdueCount}
                </span>
              )}
            </span>
          ),
        },
      ],
    },

    // ── Files ──
    {
      type: 'group',
      label: <Section label="Files" />,
      children: [
        { key: '/documents', icon: <PaperClipOutlined />, label: 'Documents' },
        { key: '/notes',     icon: <MessageOutlined />,   label: 'Notes'     },
      ],
    },
  ];

  return (
    <Sider
      className={styles.sider}
      width={228}
      collapsedWidth={64}
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      trigger={
        collapsed ? (
          <MenuUnfoldOutlined />
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <MenuFoldOutlined />
            <span style={{ fontSize: 11 }}>Collapse</span>
          </span>
        )
      }
    >
      {/* Logo */}
      <div className={styles.logoWrap}>
        <div className={`${styles.logoInner} ${collapsed ? styles.logoInnerCollapsed : ''}`}>
          <div className={styles.logoMark}>B</div>
          {!collapsed && (
            <div className={styles.logoTextGroup}>
              <span className={styles.logoTitle}>Boxfusion</span>
              <span className={styles.logoSub}>Sales Automation</span>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard */}
      <Menu
        mode="inline"
        selectedKeys={[currentPath]}
        onClick={click}
        className={styles.menu}
        inlineCollapsed={collapsed}
        style={{ marginTop: 8, flexShrink: 0 }}
        items={[{ key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' }]}
      />

      {/* Scrollable menu */}
      <div className={styles.scrollArea}>
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          defaultOpenKeys={['sub-opp']}
          onClick={click}
          className={styles.menu}
          inlineCollapsed={collapsed}
          items={items}
        />
      </div>

      {/* User footer */}
      <div className={styles.userWrap}>
        {collapsed ? (
          <Tooltip
            placement="right"
            title={
              <>
                <div style={{ fontWeight: 600, fontSize: 12 }}>
                  {user.firstName} {user.lastName}
                </div>
                <div style={{ fontSize: 11, opacity: 0.6, marginTop: 2 }}>Sales Rep</div>
              </>
            }
          >
            <div className={`${styles.userRow} ${styles.userRowCollapsed}`}>
              <div className={styles.avatar}>{initials(user.firstName, user.lastName)}</div>
            </div>
          </Tooltip>
        ) : (
          <div className={styles.userRow}>
            <div className={styles.avatar}>{initials(user.firstName, user.lastName)}</div>
            <div className={styles.userMeta}>
              <div className={styles.userNameText}>{user.firstName} {user.lastName}</div>
              <div className={styles.userRoleRow}>
                <span className={styles.roleDot} />
                <span className={styles.roleText}>Sales Rep</span>
              </div>
            </div>
            <Tooltip title="Settings">
              <SettingOutlined className={styles.settingsIcon} />
            </Tooltip>
          </div>
        )}
      </div>
    </Sider>
  );
}
