"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  defaultWorkspaceText: {
    color: token.colorTextDescription,
    fontSize: token.fontSizeSM,
  },
}));