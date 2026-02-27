"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  optionContent: {
    display: "flex",
    flexDirection: "column",
  },
  optionName: {
    fontWeight: token.fontWeightStrong,
  },
  optionEmail: {
    fontSize: token.fontSizeSM,
    color: token.colorTextDescription,
  },
}));