"use client";

import { Card, Row, Col, Statistic, Spin, Table, Avatar, Tag } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { SalesPerformanceDto } from "@/providers/dashboardProvider/types";

interface SalesPerformanceChartProps {
  salesPerformance: SalesPerformanceDto[] | null | undefined;
  loading?: boolean;
  title?: string;
}

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `R${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R${(value / 1000).toFixed(0)}K`;
  }
  return `R${value}`;
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: SalesPerformanceDto }>;
}) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "12px",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: 8 }}>{data.userName}</p>
        <p style={{ margin: "4px 0" }}>
          Total Sales: {formatCurrency(data.totalSales)}
        </p>
        <p style={{ margin: "4px 0" }}>Deals Won: {data.dealsWon}</p>
        <p style={{ margin: "4px 0" }}>Deals Lost: {data.dealsLost}</p>
        <p style={{ margin: "4px 0" }}>
          Conversion Rate: {data.conversionRate}%
        </p>
        <p style={{ margin: "4px 0" }}>
          Avg Deal Value: {formatCurrency(data.averageDealValue)}
        </p>
      </div>
    );
  }
  return null;
};

export const SalesPerformanceChart = ({
  salesPerformance,
  loading = false,
  title = "Sales Performance",
}: SalesPerformanceChartProps) => {
  const performanceList = Array.isArray(salesPerformance)
    ? salesPerformance
    : [];

  // Calculate team totals
  const totalSales = performanceList.reduce((sum, p) => sum + p.totalSales, 0);
  const totalDealsWon = performanceList.reduce((sum, p) => sum + p.dealsWon, 0);
  const totalDealsLost = performanceList.reduce(
    (sum, p) => sum + p.dealsLost,
    0,
  );
  const avgConversionRate =
    performanceList.length > 0
      ? performanceList.reduce((sum, p) => sum + p.conversionRate, 0) /
        performanceList.length
      : 0;
  const avgDealValue =
    performanceList.length > 0
      ? performanceList.reduce((sum, p) => sum + p.averageDealValue, 0) /
        performanceList.length
      : 0;

  // Sort by total sales to get top performers
  const topPerformers = [...performanceList]
    .sort((a, b) => b.totalSales - a.totalSales)
    .slice(0, 5);

  // Prepare data for bar chart
  const barChartData = performanceList.map((p) => ({
    name:
      p.userName.length > 10 ? p.userName.substring(0, 10) + "..." : p.userName,
    fullName: p.userName,
    sales: p.totalSales,
    dealsWon: p.dealsWon,
    dealsLost: p.dealsLost,
    conversionRate: p.conversionRate,
  }));

  // Prepare data for radar chart (normalize values for comparison)
  const maxValues = {
    sales: Math.max(...performanceList.map((p) => p.totalSales), 1),
    dealsWon: Math.max(...performanceList.map((p) => p.dealsWon), 1),
    conversionRate: 100,
    avgDealValue: Math.max(
      ...performanceList.map((p) => p.averageDealValue),
      1,
    ),
  };

  const radarData = performanceList.slice(0, 5).map((p) => ({
    subject: p.userName.length > 8 ? p.userName.substring(0, 8) : p.userName,
    sales: (p.totalSales / maxValues.sales) * 100,
    dealsWon: (p.dealsWon / maxValues.dealsWon) * 100,
    conversion: (p.conversionRate / maxValues.conversionRate) * 100,
    avgDeal: (p.averageDealValue / maxValues.avgDealValue) * 100,
  }));

  const tableColumns = [
    {
      title: "Rank",
      key: "rank",
      render: (_: unknown, __: unknown, index: number) => (
        <Avatar
          style={{
            backgroundColor:
              index === 0
                ? "#faad14"
                : index === 1
                  ? "#d9d9d9"
                  : index === 2
                    ? "#d48265"
                    : "#1890ff",
          }}
        >
          {index + 1}
        </Avatar>
      ),
    },
    {
      title: "Sales Rep",
      dataIndex: "userName",
      key: "userName",
      render: (text: string, record: SalesPerformanceDto) => (
        <span>
          <Avatar size="small" style={{ marginRight: 8 }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          {text}
        </span>
      ),
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (v: number) => formatCurrency(v),
      sorter: (a: { totalSales: number }, b: { totalSales: number }) =>
        a.totalSales - b.totalSales,
    },
    {
      title: "Deals Won",
      dataIndex: "dealsWon",
      key: "dealsWon",
      sorter: (a: { dealsWon: number }, b: { dealsWon: number }) =>
        a.dealsWon - b.dealsWon,
    },
    {
      title: "Deals Lost",
      dataIndex: "dealsLost",
      key: "dealsLost",
      sorter: (a: { dealsLost: number }, b: { dealsLost: number }) =>
        a.dealsLost - b.dealsLost,
    },
    {
      title: "Conversion",
      dataIndex: "conversionRate",
      key: "conversionRate",
      render: (v: number) => (
        <Tag color={v >= 30 ? "green" : v >= 20 ? "orange" : "red"}>
          {v.toFixed(1)}%
        </Tag>
      ),
      sorter: (a: { conversionRate: number }, b: { conversionRate: number }) =>
        a.conversionRate - b.conversionRate,
    },
    {
      title: "Avg Deal",
      dataIndex: "averageDealValue",
      key: "averageDealValue",
      render: (v: number) => formatCurrency(v),
      sorter: (
        a: { averageDealValue: number },
        b: { averageDealValue: number },
      ) => a.averageDealValue - b.averageDealValue,
    },
  ];

  return (
    <Card title={title}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Team Total Sales"
              value={totalSales}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 18, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Deals Won"
              value={totalDealsWon}
              valueStyle={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#3f8600",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Deals Lost"
              value={totalDealsLost}
              valueStyle={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#cf1322",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Avg Conversion Rate"
              value={avgConversionRate}
              precision={1}
              suffix="%"
              valueStyle={{ fontSize: 18, fontWeight: "bold" }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <h4 style={{ marginBottom: 16 }}>Sales by Representative</h4>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    name="Total Sales"
                    fill="#1890ff"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <h4 style={{ marginBottom: 16 }}>Performance Comparison (Top 5)</h4>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Sales"
                    dataKey="sales"
                    stroke="#1890ff"
                    fill="#1890ff"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Deals Won"
                    dataKey="dealsWon"
                    stroke="#52c41a"
                    fill="#52c41a"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Conversion"
                    dataKey="conversion"
                    stroke="#faad14"
                    fill="#faad14"
                    fillOpacity={0.3}
                  />
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <h4 style={{ marginBottom: 16 }}>Top Performers</h4>
          <Table
            dataSource={topPerformers}
            columns={tableColumns}
            rowKey="userId"
            pagination={false}
            size="small"
          />
        </div>
      </Spin>
    </Card>
  );
};

export default SalesPerformanceChart;
