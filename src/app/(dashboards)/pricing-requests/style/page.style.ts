"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  pageContainer: {
    padding: token.padding,
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: token.margin,
  },
  fullWidthDatePicker: {
    width: "100%",
  },
}));