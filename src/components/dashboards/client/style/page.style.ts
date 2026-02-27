import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token }) => ({
  pageContainer: {
    padding: "24px",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  backButton: {
    padding: "0",
  },
  pageTitle: {
    margin: "0 !important",
  },
  card: {
    marginTop: "16px",
  },
  tabs: {
    minHeight: "400px",
  },
  detailsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    color: token.colorTextSecondary,
    fontSize: "14px",
  },
  detailValue: {
    fontSize: "16px",
    fontWeight: 500,
  },
  tableContainer: {
    marginTop: "16px",
  },
  actionButton: {
    padding: "0 8px",
  },
}));
