"use client";

import { createStyles } from "antd-style";

export const useStyles = createStyles(() => ({
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f5f5f0",
    minHeight: "100vh",
    padding: "32px",
  },
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.5px",
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 13,
    color: "#888",
    marginBottom: 28,
  },
  topKpiRow: {
    marginBottom: 16,
  },

  kpiCard: {
    borderRadius: 16,
    border: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    overflow: "hidden",
    "& .ant-card-body": {
      padding: 24,
    },
  },
  kpiDark: {
    background: "#111",
    color: "#fff",
  },
  kpiAccent: {
    background: "#2563eb",
    color: "#fff",
  },
  kpiGreen: {
    background: "#16a34a",
    color: "#fff",
  },
  kpiLight: {
    background: "#fff",
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  kpiLabelMutedOnDark: {
    color: "rgba(255,255,255,0.5)",
  },
  kpiLabelSoftOnDark: {
    color: "rgba(255,255,255,0.55)",
  },
  kpiLabelMutedOnLight: {
    color: "#999",
  },
  kpiValue: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-1px",
    lineHeight: 1.1,
    marginTop: 6,
  },
  kpiValueWhite: {
    color: "#fff",
  },
  kpiValueDark: {
    color: "#111",
  },
  kpiDelta: {
    fontSize: 12,
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  kpiDeltaOnDark: {
    color: "rgba(255,255,255,0.6)",
  },
  kpiDeltaOnLight: {
    color: "#888",
  },
  textPositive: {
    color: "#4ade80",
  },
  textWarning: {
    color: "#f97316",
  },
  textSuccess: {
    color: "#16a34a",
  },

  secondaryCard: {
    borderRadius: 16,
    border: "1px solid #e8e8e0",
    boxShadow: "none",
    background: "#fff",
    "& .ant-card-body": {
      padding: 24,
    },
  },
  secondaryTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    marginBottom: 16,
  },
  titleIcon: {
    marginRight: 6,
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: "#555",
  },
  infoPill: {
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
  },
  infoPillBlue: {
    background: "#2563eb15",
    color: "#2563eb",
  },
  infoPillGreen: {
    background: "#16a34a15",
    color: "#16a34a",
  },
  infoPillRed: {
    background: "#ef444415",
    color: "#ef4444",
  },
  sectionSpacingTop: {
    marginTop: 16,
  },
  mutedCaption: {
    fontSize: 12,
    color: "#999",
    marginBottom: 6,
  },
  progressPercent: {
    fontSize: 11,
  },
  summaryBox: {
    marginTop: 16,
    padding: "10px 12px",
    background: "#f9f9f7",
    borderRadius: 10,
  },
  summaryBoxCaption: {
    fontSize: 11,
    color: "#999",
    marginBottom: 2,
  },
  revenueLabelHighlight: {
    color: "#111",
    fontWeight: 600,
  },
  revenueLabelDefault: {
    color: "#555",
    fontWeight: 400,
  },
  revenueValue: {
    fontSize: 13,
    fontWeight: 700,
  },
  revenueValueHighlight: {
    color: "#2563eb",
  },
  revenueValueDefault: {
    color: "#333",
  },
  healthValue: {
    fontSize: 13,
    fontWeight: 600,
  },
  healthValueGood: {
    color: "#16a34a",
  },
  healthValueDefault: {
    color: "#111",
  },
}));