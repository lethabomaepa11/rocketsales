"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  selector: {
    width: "100%",
  },
  entityOption: {
    display: "flex",
    flexDirection: "column",
  },
  entityTitle: {
    fontWeight: token.fontWeightStrong,
  },
  entitySubtitle: {
    fontSize: token.fontSizeSM,
    color: token.colorTextDescription,
  },
}));