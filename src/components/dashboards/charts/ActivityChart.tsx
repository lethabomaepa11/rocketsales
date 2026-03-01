"use client";

import { Card, Row, Col, Statistic, Spin, Progress, Tag } from "antd";
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
import {
  ActivitiesSummaryDto,
  StageActivityCount,
} from "@/providers/dashboardProvider/types";

interface ActivityChartProps {
  activitiesSummary: ActivitiesSummaryDto | null | undefined;
  loading?: boolean;
  title?: string;
}

const ACTIVITY_COLORS = {
  scheduled: "#1890ff",
  completed: "#52c41a",
  overdue: "#f5222d",
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "12px",
          borderRadius: "4px",
        }}
      >
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: "4px 0", color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ActivityChart = ({
  activitiesSummary,
  loading = false,
  title = "Activities Overview",
}: ActivityChartProps) => {
  const summary = activitiesSummary;

  const totalActivities = summary?.totalActivities || 0;
  const completedActivities = summary?.completedActivities || 0;
  const upcomingActivities = summary?.upcomingActivities || 0;
  const overdueActivities = summary?.overdueActivities || 0;

  const completionRate =
    totalActivities > 0
      ? Math.round((completedActivities / totalActivities) * 100)
      : 0;

  const overdueRate =
    totalActivities > 0
      ? Math.round((overdueActivities / totalActivities) * 100)
      : 0;

  // Prepare pie chart data
  const pieData = [
    {
      name: "Completed",
      value: completedActivities,
      color: ACTIVITY_COLORS.completed,
    },
    {
      name: "Upcoming",
      value: upcomingActivities,
      color: ACTIVITY_COLORS.scheduled,
    },
    {
      name: "Overdue",
      value: overdueActivities,
      color: ACTIVITY_COLORS.overdue,
    },
  ].filter((d) => d.value > 0);

  // Prepare bar chart data from activityCounts
  const barData =
    summary?.activityCounts?.map((item) => ({
      type: item.typeName,
      scheduled: item.scheduled,
      completed: item.completed,
      overdue: item.overdue,
    })) || [];

  // Calculate efficiency score (completed / (completed + overdue))
  const efficiencyScore =
    completedActivities + overdueActivities > 0
      ? Math.round(
          (completedActivities / (completedActivities + overdueActivities)) *
            100,
        )
      : 100;

  return (
    <Card title={title}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Total Activities"
              value={totalActivities}
              valueStyle={{ fontSize: 20, fontWeight: "bold" }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Completed"
              value={completedActivities}
              valueStyle={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#52c41a",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Upcoming"
              value={upcomingActivities}
              valueStyle={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1890ff",
              }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Statistic
              title="Overdue"
              value={overdueActivities}
              valueStyle={{
                fontSize: 20,
                fontWeight: "bold",
                color: overdueActivities > 0 ? "#f5222d" : undefined,
              }}
            />
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <h4 style={{ marginBottom: 16 }}>Activity Distribution</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent || 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <h4 style={{ marginBottom: 16 }}>Performance Metrics</h4>
            <div style={{ padding: "16px 0" }}>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Completion Rate</span>
                  <span style={{ fontWeight: "bold" }}>{completionRate}%</span>
                </div>
                <Progress
                  percent={completionRate}
                  strokeColor="#52c41a"
                  trailColor="#f0f0f0"
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Overdue Rate</span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: overdueRate > 20 ? "#f5222d" : undefined,
                    }}
                  >
                    {overdueRate}%
                  </span>
                </div>
                <Progress
                  percent={overdueRate}
                  strokeColor="#f5222d"
                  trailColor="#f0f0f0"
                />
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <span>Efficiency Score</span>
                  <span
                    style={{
                      fontWeight: "bold",
                      color:
                        efficiencyScore >= 80
                          ? "#52c41a"
                          : efficiencyScore >= 60
                            ? "#faad14"
                            : "#f5222d",
                    }}
                  >
                    {efficiencyScore}%
                  </span>
                </div>
                <Progress
                  percent={efficiencyScore}
                  strokeColor={
                    efficiencyScore >= 80
                      ? "#52c41a"
                      : efficiencyScore >= 60
                        ? "#faad14"
                        : "#f5222d"
                  }
                  trailColor="#f0f0f0"
                />
              </div>
            </div>
          </Col>
        </Row>

        {barData.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 16 }}>Activities by Type</h4>
            <div style={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="type" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    stackId="a"
                    fill="#52c41a"
                  />
                  <Bar
                    dataKey="scheduled"
                    name="Scheduled"
                    stackId="a"
                    fill="#1890ff"
                  />
                  <Bar
                    dataKey="overdue"
                    name="Overdue"
                    stackId="a"
                    fill="#f5222d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {summary?.activityCounts && summary.activityCounts.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 16 }}>Activity Details</h4>
            <Row gutter={[16, 16]}>
              {summary.activityCounts.map((activity) => (
                <Col xs={24} sm={12} md={8} key={activity.type}>
                  <Card size="small">
                    <Tag color="blue" style={{ marginBottom: 8 }}>
                      {activity.typeName}
                    </Tag>
                    <Row>
                      <Col span={8}>
                        <Statistic
                          title="Scheduled"
                          value={activity.scheduled}
                          valueStyle={{ fontSize: 16 }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Completed"
                          value={activity.completed}
                          valueStyle={{ fontSize: 16, color: "#52c41a" }}
                        />
                      </Col>
                      <Col span={8}>
                        <Statistic
                          title="Overdue"
                          value={activity.overdue}
                          valueStyle={{
                            fontSize: 16,
                            color: activity.overdue > 0 ? "#f5222d" : undefined,
                          }}
                        />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Spin>
    </Card>
  );
};

export default ActivityChart;
