"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  menu: {
    flex: 1,
    background: "transparent",
    border: "none",
  },
  profileSection: {
    borderTop: "1px solid rgba(5, 5, 5, 0.06)",
    padding: "12px 8px",
  },
  profileTrigger: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    background: "transparent",
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      background: "rgba(5, 5, 5, 0.04)",
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
  },
  profileEmail: {
    fontSize: 12,
    maxWidth: "100%",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  profileChevron: {
    fontSize: 10,
    opacity: 0.7,
  },
}));