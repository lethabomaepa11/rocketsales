"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  layoutRoot: {
    minHeight: "100vh",
  },
  sider: {
    backgroundColor: token.colorBgContainer,
  },
  logoImage: {
    marginBlock: "10px",
  },
  header: {
    backgroundColor: token.colorBgContainer,
    padding: "0 24px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  breadcrumb: {
    flex: 1,
    lineHeight: "64px",
  },
  userMenuTrigger: {
    cursor: "pointer",
  },
  content: {
    padding: "24px",
    minHeight: 280,
    background: token.colorBgContainer,
  },
}));