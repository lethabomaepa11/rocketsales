"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: token.colorBgContainer,
  },
  menu: {
    flex: 1,
    backgroundColor: token.colorBgContainer,
    border: "none",
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
  profileSection: {
    borderTop: `1px solid ${token.colorBorderSecondary}`,
    padding: "12px 8px",
    backgroundColor: token.colorBgContainer,
  },
  profileTrigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    backgroundColor: "transparent",
    padding: "8px 10px",
    borderRadius: token.borderRadius,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: token.colorBgTextHover,
    },
  },
  profileTriggerCollapsed: {
    justifyContent: "center",
    padding: "8px",
  },
  profileMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
    overflow: "hidden",
  },
  profileName: {
    fontSize: 13,
    fontWeight: 600,
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: token.colorText,
  },
  profileEmail: {
    fontSize: 12,
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: token.colorTextSecondary,
  },
  profileChevron: {
    fontSize: 10,
    opacity: 0.7,
    color: token.colorTextSecondary,
  },
  themeToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '8px 0',
    marginBottom: 8,
    borderRadius: token.borderRadius,
    backgroundColor: token.colorBgElevated,
  },
  themeIcon: {
    fontSize: 14,
    color: token.colorTextSecondary,
  },
}));
