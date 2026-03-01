"use client";

import { Row, Col, Card, Progress } from "antd";
import {
  ArrowUpOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  DashboardOverviewDto,
  ActivitiesSummaryDto,
} from "@/providers/dashboardProvider/types";
import { useStyles } from "./style/DashboardMetrics.style";

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

type MetricsClassNames = ReturnType<typeof useStyles>["styles"];

const DashboardMetrics = ({
  overview,
  activitiesSummary,
}: DashboardMetricsProps) => {
  const { styles } = useStyles();
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
    <div className={styles.page}>
      <div className={styles.subHeading}>
        Performance overview · Updated just now
      </div>

      {/* Top KPI row */}
      <Row gutter={[16, 16]} className={styles.topKpiRow}>
        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.kpiCard} ${styles.kpiDark}`}>
            <div className={`${styles.kpiLabel} ${styles.kpiLabelMutedOnDark}`}>
              Annual Revenue
            </div>
            <div className={`${styles.kpiValue} ${styles.kpiValueWhite}`}>
              {fmtCurrency(rev?.thisYear ?? 0)}
            </div>
            <div className={`${styles.kpiDelta} ${styles.kpiDeltaOnDark}`}>
              <ArrowUpOutlined className={styles.textPositive} />
              <span className={styles.textPositive}>
                {fmtCurrency(rev?.thisMonth ?? 0)}
              </span>
              &nbsp;this month
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.kpiCard} ${styles.kpiAccent}`}>
            <div className={`${styles.kpiLabel} ${styles.kpiLabelSoftOnDark}`}>
              Pipeline Value
            </div>
            <div className={`${styles.kpiValue} ${styles.kpiValueWhite}`}>
              {fmtCurrency(opp?.pipelineValue ?? 0)}
            </div>
            <div className={`${styles.kpiDelta} ${styles.kpiDeltaOnDark}`}>
              <DollarOutlined />
              Weighted: {fmtCurrency(weightedVal)}
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.kpiCard} ${styles.kpiGreen}`}>
            <div className={`${styles.kpiLabel} ${styles.kpiLabelSoftOnDark}`}>
              Win Rate
            </div>
            <div className={`${styles.kpiValue} ${styles.kpiValueWhite}`}>
              {winRate.toFixed(1)}%
            </div>
            <div className={`${styles.kpiDelta} ${styles.kpiDeltaOnDark}`}>
              <TrophyOutlined />
              {opp?.wonCount ?? 0} won of {opp?.totalCount ?? 0} total
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className={`${styles.kpiCard} ${styles.kpiLight}`}>
            <div
              className={`${styles.kpiLabel} ${styles.kpiLabelMutedOnLight}`}
            >
              Active Contracts
            </div>
            <div className={`${styles.kpiValue} ${styles.kpiValueDark}`}>
              {contracts?.totalActiveCount ?? 0}
            </div>
            <div className={`${styles.kpiDelta} ${styles.kpiDeltaOnLight}`}>
              {contracts?.expiringThisMonthCount ? (
                <>
                  <FireOutlined className={styles.textWarning} />{" "}
                  <span className={styles.textWarning}>
                    {contracts.expiringThisMonthCount} expiring
                  </span>{" "}
                  this month
                </>
              ) : (
                <>
                  <span className={styles.textSuccess}>✓</span> None expiring
                  this month
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
          <Card className={styles.secondaryCard}>
            <div className={styles.secondaryTitle}>
              <ClockCircleOutlined className={styles.titleIcon} /> Activity
              Breakdown
            </div>
            <ActivityRow
              label="Upcoming"
              value={act?.upcomingCount ?? 0}
              variant="blue"
              styles={styles}
            />
            <ActivityRow
              label="Completed Today"
              value={act?.completedTodayCount ?? 0}
              variant="green"
              styles={styles}
            />
            <ActivityRow
              label="Overdue"
              value={act?.overdueCount ?? 0}
              variant="red"
              styles={styles}
            />
            <div className={styles.sectionSpacingTop}>
              <div className={styles.mutedCaption}>Overdue ratio</div>
              <Progress
                percent={overdueRatio}
                strokeColor="#ef4444"
                trailColor="#f0f0f0"
                size="small"
                format={(p) => (
                  <span className={styles.progressPercent}>{p}%</span>
                )}
              />
            </div>
          </Card>
        </Col>

        {/* Revenue split */}
        <Col xs={24} md={8}>
          <Card className={styles.secondaryCard}>
            <div className={styles.secondaryTitle}>
              <DollarOutlined className={styles.titleIcon} />
              Revenue Breakdown
            </div>
            <RevenueRow
              label="This Month"
              value={rev?.thisMonth ?? 0}
              highlight
              styles={styles}
            />
            <RevenueRow
              label="This Quarter"
              value={rev?.thisQuarter ?? 0}
              styles={styles}
            />
            <RevenueRow
              label="This Year"
              value={rev?.thisYear ?? 0}
              styles={styles}
            />
            <div className={styles.summaryBox}>
              <div className={styles.summaryBoxCaption}>Quarterly pace</div>
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
          <Card className={styles.secondaryCard}>
            <div className={styles.secondaryTitle}>
              <FileTextOutlined className={styles.titleIcon} />
              Pipeline Health
            </div>
            <HealthRow
              label="Total Opportunities"
              value={fmt(opp?.totalCount ?? 0)}
              styles={styles}
            />
            <HealthRow
              label="Deals Won"
              value={fmt(opp?.wonCount ?? 0)}
              good
              styles={styles}
            />
            <HealthRow
              label="Contracts Value"
              value={fmtCurrency(contracts?.totalContractValue ?? 0)}
              styles={styles}
            />
            <HealthRow
              label="Weighted Pipeline"
              value={fmtCurrency(weightedVal)}
              styles={styles}
            />
            <div className={styles.sectionSpacingTop}>
              <div className={styles.mutedCaption}>Win rate target (30%)</div>
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

const ActivityRow = ({
  label,
  value,
  variant,
  styles,
}: {
  label: string;
  value: number;
  variant: "blue" | "green" | "red";
  styles: MetricsClassNames;
}) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span
      className={`${styles.infoPill} ${
        variant === "blue"
          ? styles.infoPillBlue
          : variant === "green"
            ? styles.infoPillGreen
            : styles.infoPillRed
      }`}
    >
      {value}
    </span>
  </div>
);

const RevenueRow = ({
  label,
  value,
  highlight,
  styles,
}: {
  label: string;
  value: number;
  highlight?: boolean;
  styles: MetricsClassNames;
}) => (
  <div className={styles.infoRow}>
    <span
      className={
        highlight ? styles.revenueLabelHighlight : styles.revenueLabelDefault
      }
    >
      {label}
    </span>
    <span
      className={`${styles.revenueValue} ${
        highlight ? styles.revenueValueHighlight : styles.revenueValueDefault
      }`}
    >
      {fmtCurrency(value)}
    </span>
  </div>
);

const HealthRow = ({
  label,
  value,
  good,
  styles,
}: {
  label: string;
  value: string;
  good?: boolean;
  styles: MetricsClassNames;
}) => (
  <div className={styles.infoRow}>
    <span className={styles.infoLabel}>{label}</span>
    <span
      className={`${styles.healthValue} ${
        good ? styles.healthValueGood : styles.healthValueDefault
      }`}
    >
      {value}
    </span>
  </div>
);

export default DashboardMetrics;
