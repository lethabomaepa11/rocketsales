"use client";

import React, { useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Progress,
  Table,
  Tag,
} from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  LineChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  useDashboardState,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useAuthState } from "@/providers/authProvider";
import {
  PipelineStage,
  MonthlyTrend,
  StageActivityCount,
} from "@/providers/dashboardProvider/types";
import { OpportunityStage } from "@/providers/opportunityProvider/types";

const { Title, Text } = Typography;

const STAGE_LABELS: Record<number, string> = {
  [OpportunityStage.Lead]: "Lead",
  [OpportunityStage.Qualified]: "Qualified",
  [OpportunityStage.Proposal]: "Proposal",
  [OpportunityStage.Negotiation]: "Negotiation",
  [OpportunityStage.ClosedWon]: "Closed Won",
  [OpportunityStage.ClosedLost]: "Closed Lost",
};

// Stage colors for charts
const STAGE_COLORS = [
  "#1890ff",
  "#52c41a",
  "#fa8c16",
  "#eb2f96",
  "#722ed1",
  "#f5222d",
];

const Dashboard = () => {
  const { user } = useAuthState();
  const { overview, pipelineMetrics, activitiesSummary, isPending } =
    useDashboardState();
  const { fetchOverview, fetchPipelineMetrics, fetchActivitiesSummary } =
    useDashboardActions();

  useEffect(() => {
    fetchOverview();
    fetchPipelineMetrics();
    fetchActivitiesSummary();
  }, []);

  const isManager =
    user?.roles?.some((r) => r.toLowerCase().includes("manager")) ?? false;

  // Prepare pipeline chart data from API
  const pipelineChartData =
    pipelineMetrics?.stages?.map((stage: PipelineStage) => ({
      name: stage.stageName || STAGE_LABELS[stage.stage] || `Stage ${stage.stage}`,
      value: stage.totalValue,
      count: stage.count,
    })) || [];

  // Prepare revenue chart data from API
  const revenueChartData =
    overview?.revenue?.monthlyTrend?.map((item: MonthlyTrend) => ({
      month: item.month,
      revenue: item.value,
      target: 150000,
    })) || [];

  // Prepare activity breakdown data from API
  const activityChartData = activitiesSummary?.activityCounts || [];

  // Pipeline table columns
  const pipelineColumns = [
    {
      title: "Stage",
      dataIndex: "stageName",
      key: "stageName",
      render: (text: string, record: PipelineStage) => (
        <Tag color={STAGE_COLORS[(record.stage - 1) % STAGE_COLORS.length]}>
          {text || STAGE_LABELS[record.stage] || `Stage ${record.stage}`}
        </Tag>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
      align: "right" as const,
    },
    {
      title: "Value",
      dataIndex: "totalValue",
      key: "totalValue",
      align: "right" as const,
      render: (value: number) => `R${(value / 1000).toFixed(0)}k`,
    },
    {
      title: "Weighted",
      dataIndex: "weightedValue",
      key: "weightedValue",
      align: "right" as const,
      render: (value: number) => `R${(value / 1000).toFixed(0)}k`,
    },
  ];

  // Activity breakdown columns
  const activityColumns = [
    {
      title: "Type",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "Scheduled",
      dataIndex: "scheduled",
      key: "scheduled",
      align: "right" as const,
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      align: "right" as const,
    },
    {
      title: "Overdue",
      dataIndex: "overdue",
      key: "overdue",
      align: "right" as const,
      render: (overdue: number) => (
        <span style={{ color: overdue > 0 ? "#cf1322" : "#3f8600" }}>
          {overdue}
        </span>
      ),
    },
  ];

  // Helper function for formatting currency
  const formatCurrency = (val: number | undefined | null) => {
    return `R${Number(val || 0).toLocaleString()}`;
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3}>Welcome back, {user?.firstName}!</Title>
          <Text type="secondary">
            Here&apos;s what&apos;s happening with your sales today.
          </Text>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Tag color="blue">
            Today&apos;s Date: {new Date().toLocaleDateString()}
          </Tag>
          <Tag color="green">
            Organization: {user?.tenantId?.substring(0, 8)}...
          </Tag>
        </div>
      </div>

      <Spin spinning={isPending}>
        {/* Key Metrics Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Revenue (Year)"
                value={overview?.revenue?.thisYear ?? 0}
                prefix={<DollarOutlined />}
                suffix="ZAR"
              />
              <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                This year&apos;s performance
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Total Pipeline Value"
                value={overview?.opportunities?.pipelineValue ?? 0}
                prefix={<DollarOutlined />}
                valueStyle={{ fontSize: "24px" }}
                suffix="ZAR"
              />
              <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                All opportunities value
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Win Rate"
                value={overview?.opportunities?.winRate ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ fontSize: "24px" }}
                suffix="%"
              />
              <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                Conversion rate
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable>
              <Statistic
                title="Activities This Week"
                value={
                  (activitiesSummary?.upcomingActivities ?? 0) +
                  (activitiesSummary?.completedActivities ?? 0)
                }
                prefix={<CalendarOutlined />}
                valueStyle={{ fontSize: "24px" }}
              />
              <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                Scheduled and completed
              </div>
            </Card>
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          {/* Revenue Trend Chart */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <span>
                  <LineChartOutlined style={{ marginRight: 8 }} />
                  Revenue Performance
                </span>
              }
              extra={
                <span style={{ color: "#666", fontSize: "12px" }}>
                  Last 6 months
                </span>
              }
            >
              {revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(val) => [formatCurrency(val as number), ""]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#52c41a"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#1890ff"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target"
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  No revenue data available
                </div>
              )}
            </Card>
          </Col>

          {/* Pipeline Distribution Chart */}
          <Col xs={24} lg={10}>
            <Card
              title={
                <span>
                  <PieChartOutlined style={{ marginRight: 8 }} />
                  Pipeline Distribution
                </span>
              }
            >
              {pipelineChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pipelineChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                    >
                      {pipelineChartData.map((_: unknown, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => [formatCurrency(val as number), ""]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div
                  style={{
                    height: 250,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                  }}
                >
                  No pipeline data available
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Detailed Stats Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={12}>
            <Card
              title="Pipeline Overview"
              extra={
                isManager && (
                  <span style={{ color: "#666", fontSize: "12px" }}>
                    Win Rate: {(pipelineMetrics?.winRate ?? 0).toFixed(1)}%
                  </span>
                )
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Total Pipeline Value"
                    value={pipelineMetrics?.weightedPipelineValue ?? 0}
                    prefix={<DollarOutlined />}
                    valueStyle={{ fontSize: "18px" }}
                    suffix="ZAR"
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Number of Opportunities"
                    value={pipelineMetrics?.totalOpportunities ?? 0}
                    valueStyle={{ fontSize: "18px" }}
                  />
                </Col>
              </Row>
              {isManager && (
                <div style={{ marginTop: 16 }}>
                  <Progress
                    percent={pipelineMetrics?.winRate ?? 0}
                    status="active"
                    strokeColor="#52c41a"
                  />
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Activities Summary">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Completed"
                    value={activitiesSummary?.completedActivities ?? 0}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#3f8600", fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Upcoming"
                    value={activitiesSummary?.upcomingActivities ?? 0}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ fontSize: "18px" }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Overdue"
                    value={activitiesSummary?.overdueActivities ?? 0}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#cf1322", fontSize: "18px" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Tables Row */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card title="Pipeline by Stage">
              <Table
                columns={pipelineColumns}
                dataSource={pipelineMetrics?.stages || []}
                pagination={false}
                size="small"
                rowKey="stage"
              />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Activity Breakdown">
              <Table
                columns={activityColumns}
                dataSource={activityChartData}
                pagination={false}
                size="small"
                rowKey="type"
              />
            </Card>
          </Col>
        </Row>

        {/* Manager-specific metrics */}
        {isManager && (
          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} sm={8}>
              <Card hoverable>
                <Statistic
                  title="Total Opportunities"
                  value={overview?.opportunities?.totalCount ?? 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ fontSize: "24px" }}
                />
                <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                  In pipeline
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable>
                <Statistic
                  title="Active Contracts"
                  value={overview?.contracts?.totalActiveCount ?? 0}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ fontSize: "24px" }}
                />
                <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                  Active agreements
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card hoverable>
                <Statistic
                  title="Expiring Soon"
                  value={overview?.contracts?.expiringThisMonthCount ?? 0}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: "#fa8c16", fontSize: "24px" }}
                />
                <div style={{ marginTop: 8, fontSize: "12px", color: "#666" }}>
                  This month
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default Dashboard;
