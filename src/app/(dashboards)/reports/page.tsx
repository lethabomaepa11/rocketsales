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
  Tabs,
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
  PieChartOutlined,
  LineChartOutlined as LineIcon,
} from "@ant-design/icons";
import {
  useDashboardState,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useReportState, useReportActions } from "@/providers/reportProvider";
import { useReportPDF } from "@/hooks/useReportPDF";
import { useStyles } from "./style/page.style";
import {
  RevenueTrendChart,
  PipelineFunnelChart,
  SalesPerformanceChart,
  ActivityChart,
} from "@/components/dashboards/charts";
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
  const { overview, salesPerformance, activitiesSummary, pipelineMetrics } =
    useDashboardState();
  const {
    fetchOverview,
    fetchSalesPerformance,
    fetchActivitiesSummary,
    fetchPipelineMetrics,
  } = useDashboardActions();
  const { opportunityReport, salesByPeriod, isPending } = useReportState();
  const { fetchOpportunityReport, fetchSalesByPeriod } = useReportActions();
  const { generateReportPDF, isGenerating } = useReportPDF();

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [groupBy, setGroupBy] = useState<"month" | "week">("month");
  const [activeTab, setActiveTab] = useState("overview");

  // Initial load
  useEffect(() => {
    fetchOverview();
    fetchSalesPerformance();
    fetchActivitiesSummary();
    fetchPipelineMetrics();
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

  const tabItems = [
    {
      key: "overview",
      label: (
        <span>
          <PieChartOutlined /> Overview
        </span>
      ),
      children: (
        <>
          {/* Top KPIs */}
          <Row gutter={16} className={styles.topKpiRow}>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Revenue (Year)"
                  value={overview?.revenue?.thisYear || 0}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Win Rate"
                  value={overview?.opportunities?.winRate || 0}
                  suffix="%"
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="Total Opportunities"
                  value={overview?.opportunities?.totalCount || 0}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
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

          {/* Sales Performance */}
          <Row gutter={16} className={styles.summaryRow}>
            <Col span={24}>
              <SalesPerformanceChart
                salesPerformance={salesPerformance}
                loading={isPending}
                title="Sales Team Performance"
              />
            </Col>
          </Row>

          {/* Pipeline Funnel */}
          <Row gutter={16} className={styles.summaryRow}>
            <Col span={24}>
              <PipelineFunnelChart
                stages={pipelineMetrics?.stages}
                loading={isPending}
                title="Pipeline Analysis"
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "revenue",
      label: (
        <span>
          <DollarOutlined /> Revenue
        </span>
      ),
      children: (
        <>
          {/* Revenue Trend */}
          <Row gutter={16} className={styles.summaryRow}>
            <Col span={24}>
              <RevenueTrendChart
                monthlyTrend={overview?.revenue?.monthlyTrend}
                loading={isPending}
                title="Revenue Trend Analysis"
              />
            </Col>
          </Row>

          {/* Sales by Period */}
          <Card
            title="Sales by Period"
            className={styles.opportunitiesCard}
            extra={
              <Select
                value={groupBy}
                onChange={setGroupBy}
                style={{ width: 120 }}
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
        </>
      ),
    },
    {
      key: "opportunities",
      label: (
        <span>
          <FileTextOutlined /> Opportunities
        </span>
      ),
      children: (
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
      ),
    },
    {
      key: "activities",
      label: (
        <span>
          <LineChartOutlined /> Activities
        </span>
      ),
      children: (
        <ActivityChart
          activitiesSummary={activitiesSummary}
          loading={isPending}
          title="Activity Overview"
        />
      ),
    },
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

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default ReportsPage;
