"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(() => ({
  pageContainer: {
    padding: 24,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fullWidthDatePicker: {
    width: "100%",
  },
  lineItemsSection: {
    marginTop: 16,
  },
  lineItemsWrapper: {
    marginTop: 8,
  },
}));
