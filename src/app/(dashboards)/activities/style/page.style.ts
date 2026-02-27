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
  overdueDateText: {
    color: token.colorError,
  },
  relatedMetaText: {
    fontSize: token.fontSizeSM,
  },
  fullWidthDatePicker: {
    width: "100%",
  },
  participantForm: {
    marginBottom: token.margin,
  },
}));