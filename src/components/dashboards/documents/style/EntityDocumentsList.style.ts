"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(() => ({
  loadingSpinner: {
    display: "block",
    textAlign: "center",
    padding: 24,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  uploadForm: {
    marginBottom: 16,
  },
  metaText: {
    fontSize: 12,
  },
}));