"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Typography,
  Select,
  Spin,
  Button,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  useDashboardState,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useReportState, useReportActions } from "@/providers/reportProvider";
import { useReportPDF } from "@/hooks/useReportPDF";
import { useStyles } from "./style/page.style";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const stageMap: Record<number, { label: string; color: string }> = {
  1: { label: "Lead", color: "default" },
  2: { label: "Qualified", color: "blue" },
  3: { label: "Proposal", color: "cyan" },
  4: { label: "Negotiation", color: "orange" },
  5: { label: "Closed Won", color: "green" },
  6: { label: "Closed Lost", color: "red" },
};

const ReportsPage = () => {
  const { styles } = useStyles();
  const { overview, salesPerformance, activitiesSummary } = useDashboardState();
  const { fetchOverview, fetchSalesPerformance, fetchActivitiesSummary } =
    useDashboardActions();
  const { opportunityReport, salesByPeriod, isPending } = useReportState();
  const { fetchOpportunityReport, fetchSalesByPeriod } = useReportActions();
  const { generateReportPDF, isGenerating } = useReportPDF();

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [groupBy, setGroupBy] = useState<"month" | "week">("month");

  // Initial load
  useEffect(() => {
    fetchOverview();
    fetchSalesPerformance();
    fetchActivitiesSummary();
    fetchOpportunityReport();
    fetchSalesByPeriod({ groupBy: "month" });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch reports when filters change
  useEffect(() => {
    const dateParams = dateRange
      ? {
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        }
      : {};
    fetchOpportunityReport(dateParams);
    fetchSalesByPeriod({ ...dateParams, groupBy });
  }, [dateRange, groupBy]); // eslint-disable-line react-hooks/exhaustive-deps

  // Correctly average rates/values, sum counts
  const performanceList = Array.isArray(salesPerformance)
    ? salesPerformance
    : [];
  const repCount = performanceList.length || 1;
  const salesPerformanceSummary = performanceList.reduce(
    (acc, item) => ({
      dealsWon: acc.dealsWon + item.dealsWon,
      dealsLost: acc.dealsLost + item.dealsLost,
      averageDealValue: acc.averageDealValue + item.averageDealValue / repCount,
      conversionRate: acc.conversionRate + item.conversionRate / repCount,
    }),
    { dealsWon: 0, dealsLost: 0, averageDealValue: 0, conversionRate: 0 },
  );

  const oppColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Owner", dataIndex: "ownerName", key: "ownerName" },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (v: number) =>
        `R ${(v || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
      sorter: (a: { estimatedValue: number }, b: { estimatedValue: number }) =>
        a.estimatedValue - b.estimatedValue,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (s: number) => {
        const info = stageMap[s] || { label: String(s), color: "default" };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (p: number) => `${p}%`,
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
  ];

  const salesColumns = [
    { title: "Period", dataIndex: "period", key: "period" },
    {
      title: "Revenue",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (v: number) =>
        `R ${(v || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    },
    { title: "Deals", dataIndex: "count", key: "count" },
  ];

  return (
    <div className={styles.pageContainer}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={3} style={{ margin: 0 }}>
            Reports &amp; Analytics
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={generateReportPDF}
            loading={isGenerating}
          >
            Download PDF
          </Button>
        </Col>
      </Row>

      {/* Top KPIs */}
      <Row gutter={16} className={styles.topKpiRow}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue (Year)"
              value={overview?.revenue?.thisYear || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Win Rate"
              value={overview?.opportunities?.winRate || 0}
              suffix="%"
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Opportunities"
              value={overview?.opportunities?.totalCount || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Completed Activities"
              value={activitiesSummary?.completedActivities || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Sales Performance + Activities Summary */}
      <Row gutter={16} className={styles.summaryRow}>
        <Col span={12}>
          <Card title="Sales Performance">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Deals Won"
                  value={salesPerformanceSummary.dealsWon}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Deals Lost"
                  value={salesPerformanceSummary.dealsLost}
                  prefix={<FallOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg Conversion Rate"
                  value={Number(
                    salesPerformanceSummary.conversionRate.toFixed(1),
                  )}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg Deal Value"
                  value={Number(
                    salesPerformanceSummary.averageDealValue.toFixed(0),
                  )}
                  prefix={<DollarOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Activities Summary">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total"
                  value={activitiesSummary?.totalActivities || 0}
                  prefix={<BarChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Upcoming"
                  value={activitiesSummary?.upcomingActivities || 0}
                  prefix={<LineChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Overdue"
                  value={activitiesSummary?.overdueActivities || 0}
                  prefix={<FallOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Completed"
                  value={activitiesSummary?.completedActivities || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Opportunities Report */}
      <Card
        title="Opportunities Report"
        className={styles.opportunitiesCard}
        extra={
          <RangePicker
            onChange={(dates) =>
              setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
            }
          />
        }
      >
        <Spin spinning={isPending}>
          <Table
            dataSource={opportunityReport}
            columns={oppColumns}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>

      {/* Sales by Period */}
      <Card
        title="Sales by Period"
        extra={
          <Select
            value={groupBy}
            onChange={setGroupBy}
            className={styles.periodGroupSelect}
            options={[
              { label: "Monthly", value: "month" },
              { label: "Weekly", value: "week" },
            ]}
          />
        }
      >
        <Spin spinning={isPending}>
          <Table
            dataSource={salesByPeriod}
            columns={salesColumns}
            rowKey="period"
            size="small"
            pagination={false}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default ReportsPage;
