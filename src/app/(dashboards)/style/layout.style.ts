"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  layoutRoot: {
    minHeight: "100vh",
  },
  sider: {
    backgroundColor: token.colorBgContainer,
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    overflow: "auto",
    zIndex: 20,
    transition: "all 0.2s ease",
    "& .ant-layout-sider-children": {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
  },
  siderDesktop: {
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.06)",
  },
  siderMobile: {
    zIndex: 30,
  },
  logoImage: {
    marginBlock: "10px",
  },
  mainLayout: {
    minWidth: 0,
    minHeight: "100vh",
    transition: "margin-left 0.2s ease",
  },
  mainLayoutExpanded: {
    marginLeft: 240,
  },
  mainLayoutCollapsed: {
    marginLeft: 80,
  },
  mainLayoutMobile: {
    marginLeft: 0,
  },
  mobileTopBar: {
    backgroundColor: token.colorBgContainer,
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${token.colorBorderSecondary}`,
  },
  mobileMenuButton: {
    fontSize: 18,
  },
  mobileBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.35)",
    zIndex: 15,
  },
  content: {
    padding: "24px",
    minHeight: 280,
    background: token.colorBgContainer,
    "@media (max-width: 991px)": {
      padding: "16px",
    },
  },
}));