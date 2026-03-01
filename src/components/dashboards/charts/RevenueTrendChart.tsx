"use client";

import { Card, Row, Col, Statistic, Select, Spin } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
  Line,
} from "recharts";
import { MonthlyTrend } from "@/providers/dashboardProvider/types";

interface RevenueTrendChartProps {
  monthlyTrend: MonthlyTrend[] | undefined;
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
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
        }}
      >
        <p style={{ fontWeight: "bold", marginBottom: 8 }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color, margin: "4px 0" }}>
            {entry.dataKey === "value"
              ? "Revenue"
              : entry.dataKey === "target"
                ? "Target"
                : entry.dataKey}
            : {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const RevenueTrendChart = ({
  monthlyTrend,
  loading = false,
  title = "Revenue Trend",
}: RevenueTrendChartProps) => {
  // Process data for chart
  const chartData = monthlyTrend
    ? monthlyTrend.map((item) => ({
        month: item.month,
        value: item.value,
        // Create a simulated target (you can adjust this based on your business logic)
        target: item.value * 1.1, // 10% above actual as target
      }))
    : [];

  // Calculate statistics
  const totalRevenue =
    monthlyTrend?.reduce((sum, item) => sum + item.value, 0) || 0;
  const averageMonthly = monthlyTrend?.length
    ? totalRevenue / monthlyTrend.length
    : 0;
  const lastMonth =
    monthlyTrend && monthlyTrend.length > 0
      ? monthlyTrend[monthlyTrend.length - 1].value
      : 0;
  const previousMonth =
    monthlyTrend && monthlyTrend.length > 1
      ? monthlyTrend[monthlyTrend.length - 2].value
      : 0;
  const monthOverMonthGrowth =
    previousMonth > 0 ? ((lastMonth - previousMonth) / previousMonth) * 100 : 0;

  // Get top performing month
  const topMonth = monthlyTrend?.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { month: "", value: 0 },
  );

  return (
    <Card
      title={title}
      extra={
        <Select
          defaultValue="12months"
          style={{ width: 120 }}
          options={[
            { label: "Last 6 Months", value: "6months" },
            { label: "Last 12 Months", value: "12months" },
            { label: "YTD", value: "ytd" },
          ]}
        />
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 20, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Monthly Average"
              value={averageMonthly}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 20, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="MoM Growth"
              value={monthOverMonthGrowth}
              precision={1}
              suffix="%"
              valueStyle={{
                fontSize: 20,
                fontWeight: "bold",
                color: monthOverMonthGrowth >= 0 ? "#3f8600" : "#cf1322",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Best Month"
              value={topMonth?.value || 0}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 20, fontWeight: "bold" }}
              suffix={
                <span style={{ fontSize: 12, fontWeight: "normal" }}>
                  ({topMonth?.month})
                </span>
              }
            />
          </Col>
        </Row>

        <div style={{ height: 300, marginTop: 24 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#d9d9d9" }}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#d9d9d9" }}
                axisLine={{ stroke: "#d9d9d9" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="value"
                name="Revenue"
                fill="#1890ff"
                barSize={30}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="target"
                name="Target"
                stroke="#faad14"
                strokeWidth={2}
                dot={{ fill: "#faad14", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Spin>
    </Card>
  );
};

export default RevenueTrendChart;
