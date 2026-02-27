"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  layoutRoot: {
    minHeight: "100vh",
    backgroundColor: token.colorBgLayout,
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
      backgroundColor: token.colorBgContainer,
    },
    "& .ant-menu": {
      backgroundColor: token.colorBgContainer,
    },
    "& .ant-menu-item": {
      color: token.colorText,
      "&:hover": {
        color: token.colorPrimary,
        backgroundColor: token.colorBgTextHover,
      },
      "&.ant-menu-item-selected": {
        backgroundColor: token.colorPrimaryBg,
        color: token.colorPrimary,
      },
    },
    "& .ant-menu-item-icon": {
      color: "inherit",
    },
  },
  siderDesktop: {
    boxShadow: token.boxShadow,
  },
  siderMobile: {
    zIndex: 30,
    boxShadow: token.boxShadowSecondary,
  },
  logoImage: {
    marginBlock: "10px",
    paddingInline: "16px",
  },
  mainLayout: {
    minWidth: 0,
    minHeight: "100vh",
    transition: "margin-left 0.2s ease",
    backgroundColor: token.colorBgLayout,
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
    color: token.colorText,
  },
  mobileBackdrop: {
    position: "fixed",
    inset: 0,
    background: token.colorBgMask,
    zIndex: 15,
  },
  content: {
    padding: "24px",
    minHeight: 280,
    backgroundColor: token.colorBgLayout,
    color: token.colorText,
    "@media (max-width: 991px)": {
      padding: "16px",
    },
  },
}));
