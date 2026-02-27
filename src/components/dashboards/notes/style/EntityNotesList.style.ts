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
  addForm: {
    marginBottom: 16,
  },
  switchFormItem: {
    marginBottom: 8,
  },
  editForm: {
    width: "100%",
  },
  compactFormItem: {
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
  },
  noteParagraph: {
    marginBottom: 0,
  },
}));