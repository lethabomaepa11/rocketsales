"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  summaryRow: {
    marginTop: token.marginXS,
    width: "100%",
    justifyContent: "space-between",
  },
}));