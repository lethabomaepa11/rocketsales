"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: token.margin,
  },
  backButton: {
    marginRight: token.margin,
  },
}));