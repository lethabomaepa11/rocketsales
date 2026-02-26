"use client";

import { Row, Col, Card, Statistic, Progress, Badge } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  DashboardOverviewDto,
  ActivitiesSummaryDto,
} from "@/providers/dashboardProvider/types";

interface DashboardMetricsProps {
  overview: DashboardOverviewDto | null;
  activitiesSummary: ActivitiesSummaryDto | null;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(n);

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(n);

const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    background: "#f5f5f0",
    minHeight: "100vh",
    padding: "32px",
  } as React.CSSProperties,
  heading: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111",
    letterSpacing: "-0.5px",
    marginBottom: 4,
  } as React.CSSProperties,
  sub: { fontSize: 13, color: "#888", marginBottom: 28 } as React.CSSProperties,

  // Primary KPI cards
  kpiCard: {
    borderRadius: 16,
    border: "none",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    overflow: "hidden",
  } as React.CSSProperties,
  kpiDark: { background: "#111", color: "#fff" } as React.CSSProperties,
  kpiAccent: { background: "#2563eb", color: "#fff" } as React.CSSProperties,
  kpiGreen: { background: "#16a34a", color: "#fff" } as React.CSSProperties,
  kpiLight: { background: "#fff" } as React.CSSProperties,

  label: {
    fontSize: 12,
    fontWeight: 500,
    opacity: 0.65,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  } as React.CSSProperties,
  value: {
    fontSize: 32,
    fontWeight: 800,
    letterSpacing: "-1px",
    lineHeight: 1.1,
    marginTop: 6,
  } as React.CSSProperties,
  valueLight: { color: "#111" } as React.CSSProperties,
  valueWhite: { color: "#fff" } as React.CSSProperties,
  delta: {
    fontSize: 12,
    marginTop: 10,
    display: "flex",
    alignItems: "center",
    gap: 4,
  } as React.CSSProperties,

  // Secondary cards
  secCard: {
    borderRadius: 16,
    border: "1px solid #e8e8e0",
    boxShadow: "none",
    background: "#fff",
  } as React.CSSProperties,
  secTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
    marginBottom: 16,
  } as React.CSSProperties,
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  } as React.CSSProperties,
  pill: {
    borderRadius: 20,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 600,
  } as React.CSSProperties,
};

const DashboardMetrics = ({
  overview,
  activitiesSummary,
}: DashboardMetricsProps) => {
  const rev = overview?.revenue;
  const opp = overview?.opportunities;
  const act = overview?.activities;
  const contracts = overview?.contracts;
  const pipeline = overview?.pipeline;

  const totalActivities =
    (activitiesSummary?.upcomingActivities ?? 0) +
    (activitiesSummary?.completedActivities ?? 0);

  const overdueRatio =
    act?.overdueCount && totalActivities
      ? Math.round((act.overdueCount / totalActivities) * 100)
      : 0;

  const winRate = opp?.winRate ?? 0;
  const weightedVal = pipeline?.weightedPipelineValue ?? 0;

  return (
    <div style={styles.page}>
      <div style={styles.heading}>Sales Dashboard</div>
      <div style={styles.sub}>Performance overview · Updated just now</div>

      {/* Top KPI row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ ...styles.kpiCard, ...styles.kpiDark }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ ...styles.label, color: "rgba(255,255,255,0.5)" }}>
              Annual Revenue
            </div>
            <div style={{ ...styles.value, ...styles.valueWhite }}>
              {fmtCurrency(rev?.thisYear ?? 0)}
            </div>
            <div style={{ ...styles.delta, color: "rgba(255,255,255,0.6)" }}>
              <ArrowUpOutlined style={{ color: "#4ade80" }} />
              <span style={{ color: "#4ade80" }}>
                {fmtCurrency(rev?.thisMonth ?? 0)}
              </span>
              &nbsp;this month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ ...styles.kpiCard, ...styles.kpiAccent }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ ...styles.label, color: "rgba(255,255,255,0.55)" }}>
              Pipeline Value
            </div>
            <div style={{ ...styles.value, ...styles.valueWhite }}>
              {fmtCurrency(opp?.pipelineValue ?? 0)}
            </div>
            <div style={{ ...styles.delta, color: "rgba(255,255,255,0.6)" }}>
              <DollarOutlined />
              Weighted: {fmtCurrency(weightedVal)}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ ...styles.kpiCard, ...styles.kpiGreen }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ ...styles.label, color: "rgba(255,255,255,0.55)" }}>
              Win Rate
            </div>
            <div style={{ ...styles.value, ...styles.valueWhite }}>
              {winRate.toFixed(1)}%
            </div>
            <div style={{ ...styles.delta, color: "rgba(255,255,255,0.6)" }}>
              <TrophyOutlined />
              {opp?.wonCount ?? 0} won of {opp?.totalCount ?? 0} total
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{ ...styles.kpiCard, ...styles.kpiLight }}
            bodyStyle={{ padding: 24 }}
          >
            <div style={{ ...styles.label, color: "#999" }}>
              Active Contracts
            </div>
            <div style={{ ...styles.value, ...styles.valueLight }}>
              {contracts?.totalActiveCount ?? 0}
            </div>
            <div style={{ ...styles.delta, color: "#888" }}>
              {contracts?.expiringThisMonthCount ? (
                <>
                  <FireOutlined style={{ color: "#f97316" }} />{" "}
                  <span style={{ color: "#f97316" }}>
                    {contracts.expiringThisMonthCount} expiring
                  </span>{" "}
                  this month
                </>
              ) : (
                <>
                  <span style={{ color: "#16a34a" }}>✓</span> None expiring this
                  month
                </>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Secondary row */}
      <Row gutter={[16, 16]}>
        {/* Activity breakdown */}
        <Col xs={24} md={8}>
          <Card style={styles.secCard} bodyStyle={{ padding: 24 }}>
            <div style={styles.secTitle}>
              <CalIconInline /> Activity Breakdown
            </div>
            <ActivityRow
              label="Upcoming"
              value={act?.upcomingCount ?? 0}
              color="#2563eb"
            />
            <ActivityRow
              label="Completed Today"
              value={act?.completedTodayCount ?? 0}
              color="#16a34a"
            />
            <ActivityRow
              label="Overdue"
              value={act?.overdueCount ?? 0}
              color="#ef4444"
            />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                Overdue ratio
              </div>
              <Progress
                percent={overdueRatio}
                strokeColor="#ef4444"
                trailColor="#f0f0f0"
                size="small"
                format={(p) => <span style={{ fontSize: 11 }}>{p}%</span>}
              />
            </div>
          </Card>
        </Col>

        {/* Revenue split */}
        <Col xs={24} md={8}>
          <Card style={styles.secCard} bodyStyle={{ padding: 24 }}>
            <div style={styles.secTitle}>
              <DollarOutlined style={{ marginRight: 6 }} />
              Revenue Breakdown
            </div>
            <RevenueRow
              label="This Month"
              value={rev?.thisMonth ?? 0}
              highlight
            />
            <RevenueRow label="This Quarter" value={rev?.thisQuarter ?? 0} />
            <RevenueRow label="This Year" value={rev?.thisYear ?? 0} />
            <div
              style={{
                marginTop: 16,
                padding: "10px 12px",
                background: "#f9f9f7",
                borderRadius: 10,
              }}
            >
              <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>
                Quarterly pace
              </div>
              <Progress
                percent={
                  rev?.thisQuarter && rev?.thisYear
                    ? Math.round((rev.thisQuarter / rev.thisYear) * 100)
                    : 0
                }
                strokeColor="#2563eb"
                trailColor="#e8e8e0"
                size="small"
              />
            </div>
          </Card>
        </Col>

        {/* Pipeline health */}
        <Col xs={24} md={8}>
          <Card style={styles.secCard} bodyStyle={{ padding: 24 }}>
            <div style={styles.secTitle}>
              <FileTextOutlined style={{ marginRight: 6 }} />
              Pipeline Health
            </div>
            <HealthRow
              label="Total Opportunities"
              value={fmt(opp?.totalCount ?? 0)}
            />
            <HealthRow label="Deals Won" value={fmt(opp?.wonCount ?? 0)} good />
            <HealthRow
              label="Contracts Value"
              value={fmtCurrency(contracts?.totalContractValue ?? 0)}
            />
            <HealthRow
              label="Weighted Pipeline"
              value={fmtCurrency(weightedVal)}
            />
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>
                Win rate target (30%)
              </div>
              <Progress
                percent={Math.min(winRate, 100)}
                success={{ percent: 30, strokeColor: "#e8e8e0" }}
                strokeColor={winRate >= 30 ? "#16a34a" : "#f97316"}
                trailColor="#f0f0f0"
                size="small"
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Small helper components (keep total lines low)
const CalIconInline = () => <ClockCircleOutlined style={{ marginRight: 6 }} />;

const ActivityRow = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    }}
  >
    <span style={{ fontSize: 13, color: "#555" }}>{label}</span>
    <span style={{ ...styles.pill, background: color + "15", color }}>
      {value}
    </span>
  </div>
);

const RevenueRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    }}
  >
    <span
      style={{
        fontSize: 13,
        color: highlight ? "#111" : "#555",
        fontWeight: highlight ? 600 : 400,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 700,
        color: highlight ? "#2563eb" : "#333",
      }}
    >
      {fmtCurrency(value)}
    </span>
  </div>
);

const HealthRow = ({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good?: boolean;
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    }}
  >
    <span style={{ fontSize: 13, color: "#555" }}>{label}</span>
    <span
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: good ? "#16a34a" : "#111",
      }}
    >
      {value}
    </span>
  </div>
);

export default DashboardMetrics;
