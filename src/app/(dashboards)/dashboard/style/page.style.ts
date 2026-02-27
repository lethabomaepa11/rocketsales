"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  loadingState: {
    textAlign: "center",
    padding: token.paddingXL,
  },
  pageContainer: {
    padding: token.padding,
  },
  pageTitle: {
    marginBottom: token.marginLG,
  },
  summaryCardContent: {
    padding: token.padding,
    textAlign: "center",
  },
}));