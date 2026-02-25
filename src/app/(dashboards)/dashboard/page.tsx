"use client";

import React, { useEffect } from "react";
import { Card, Row, Col, Statistic, Typography, Spin } from "antd";
import {
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import {
  useDashboardState,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useAuthState } from "@/providers/authProvider";

const { Title, Text } = Typography;

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

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Welcome back, {user?.firstName}!</Title>
      <Text type="secondary">
        Here&apos;s what&apos;s happening with your sales today.
      </Text>

      <Spin spinning={isPending}>
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Revenue"
                value={overview?.totalRevenue ?? 0}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Clients"
                value={overview?.totalClients ?? 0}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Proposals"
                value={overview?.activeProposals ?? 0}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Activities This Week"
                value={activitiesSummary?.totalActivities ?? 0}
                prefix={<CalendarOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Pipeline Overview">
              <Statistic
                title="Total Pipeline Value"
                value={pipelineMetrics?.totalPipelineValue ?? 0}
                prefix={<DollarOutlined />}
              />
              <Statistic
                title="Number of Opportunities"
                value={pipelineMetrics?.totalOpportunities ?? 0}
              />
              {isManager && (
                <Statistic
                  title="Win Rate"
                  value={pipelineMetrics?.winRate ?? 0}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Activities Summary">
              <Statistic
                title="Completed Activities"
                value={activitiesSummary?.completedActivities ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <Statistic
                title="Upcoming Activities"
                value={activitiesSummary?.upcomingActivities ?? 0}
                prefix={<CalendarOutlined />}
              />
              <Statistic
                title="Overdue Activities"
                value={activitiesSummary?.overdueActivities ?? 0}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>

        {isManager && (
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Monthly Growth"
                  value={overview?.monthlyGrowth ?? 0}
                  suffix="%"
                  prefix={<RiseOutlined />}
                  valueStyle={{
                    color:
                      overview?.monthlyGrowth && overview.monthlyGrowth >= 0
                        ? "#3f8600"
                        : "#cf1322",
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Contracts"
                  value={overview?.totalContracts ?? 0}
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Opportunities"
                  value={overview?.totalOpportunities ?? 0}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>
        )}
      </Spin>
    </div>
  );
};

export default Dashboard;
