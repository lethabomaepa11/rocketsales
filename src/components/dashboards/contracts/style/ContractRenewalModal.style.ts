"use client";
import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  contractMetaRow: {
    marginBottom: token.margin,
  },
  createRenewalButton: {
    marginTop: token.margin,
    width: "100%",
  },
  createRenewalForm: {
    marginTop: token.margin,
  },
}));