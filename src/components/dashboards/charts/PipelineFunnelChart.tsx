"use client";

import { Card, Row, Col, Statistic, Spin, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { PipelineStage } from "@/providers/dashboardProvider/types";

interface PipelineFunnelChartProps {
  stages: PipelineStage[] | undefined;
  loading?: boolean;
  title?: string;
}

interface StageData {
  name: string;
  stageName: string;
  count: number;
  value: number;
  weightedValue: number;
}

const STAGE_COLORS = [
  "#87d068",
  "#108ee9",
  "#13c2c2",
  "#fa8c16",
  "#52c41a",
  "#f5222d",
];

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
  payload?: Array<{ payload: StageData }>;
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
        <p style={{ fontWeight: "bold", marginBottom: 8 }}>{data.stageName}</p>
        <p style={{ margin: "4px 0" }}>Count: {data.count}</p>
        <p style={{ margin: "4px 0" }}>
          Total Value: {formatCurrency(data.value)}
        </p>
        <p style={{ margin: "4px 0" }}>
          Weighted Value: {formatCurrency(data.weightedValue)}
        </p>
      </div>
    );
  }
  return null;
};

export const PipelineFunnelChart = ({
  stages,
  loading = false,
  title = "Pipeline Funnel",
}: PipelineFunnelChartProps) => {
  const pieData: StageData[] = stages
    ? stages
        .filter((s) => s.stage < 5)
        .map((stage) => ({
          name: stage.stageName,
          stageName: stage.stageName,
          value: stage.totalValue,
          count: stage.count,
          weightedValue: stage.weightedValue,
        }))
    : [];

  const barData: StageData[] = stages
    ? stages.map((stage) => ({
        name: stage.stageName,
        stageName: stage.stageName,
        count: stage.count,
        value: stage.totalValue,
        weightedValue: stage.weightedValue,
      }))
    : [];

  const totalPipelineValue =
    stages?.reduce((sum, s) => sum + s.totalValue, 0) || 0;
  const weightedPipelineValue =
    stages?.reduce((sum, s) => sum + s.weightedValue, 0) || 0;
  const totalOpportunities = stages?.reduce((sum, s) => sum + s.count, 0) || 0;

  const wonStage = stages?.find((s) => s.stage === 5);
  const lostStage = stages?.find((s) => s.stage === 6);
  const closedCount = (wonStage?.count || 0) + (lostStage?.count || 0);
  const winRate =
    closedCount > 0
      ? Math.round(((wonStage?.count || 0) / closedCount) * 100)
      : 0;

  const columns: ColumnsType<StageData> = [
    {
      title: "Stage",
      dataIndex: "stageName",
      key: "stageName",
      render: (text: string, _record: StageData, index: number) => (
        <Tag color={STAGE_COLORS[index % STAGE_COLORS.length]}>{text}</Tag>
      ),
    },
    {
      title: "Count",
      dataIndex: "count",
      key: "count",
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (v: number) => formatCurrency(v),
    },
    {
      title: "Weighted",
      dataIndex: "weightedValue",
      key: "weightedValue",
      render: (v: number) => formatCurrency(v),
    },
  ];

  return (
    <Card title={title}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Pipeline"
              value={totalPipelineValue}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ fontSize: 18, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Weighted Pipeline"
              value={weightedPipelineValue}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#1890ff",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Opportunities"
              value={totalOpportunities}
              valueStyle={{ fontSize: 18, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Win Rate"
              value={winRate}
              suffix="%"
              valueStyle={{
                fontSize: 18,
                fontWeight: "bold",
                color: winRate >= 30 ? "#3f8600" : "#cf1322",
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={12}>
            <h4 style={{ marginBottom: 16 }}>Pipeline Distribution</h4>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STAGE_COLORS[index % STAGE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <h4 style={{ marginBottom: 16 }}>Opportunities by Stage</h4>
            <div style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tickFormatter={formatCurrency} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    name="Value"
                    fill="#1890ff"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="weightedValue"
                    name="Weighted"
                    fill="#722ed1"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        <div style={{ marginTop: 24 }}>
          <h4 style={{ marginBottom: 16 }}>Stage Details</h4>
          <Table
            dataSource={barData}
            columns={columns}
            rowKey="name"
            pagination={false}
            size="small"
          />
        </div>
      </Spin>
    </Card>
  );
};

export default PipelineFunnelChart;
