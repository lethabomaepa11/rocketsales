"use client";

import { useState, useEffect } from "react";
import { Card, Row, Col, Spin, Alert, Typography, Divider } from "antd";
import {
  DashboardProvider,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useDashboardState } from "@/providers/dashboardProvider";
import DashboardMetrics from "@/components/dashboards/dashboard/DashboardMetrics";

const { Title } = Typography;

const DashboardPage = () => {
  const {
    overview,
    pipelineMetrics,
    activitiesSummary,
    salesPerformance,
    contractsExpiring,
    loading,
    error,
  } = useDashboardState();

  const {
    fetchOverview,
    fetchPipelineMetrics,
    fetchActivitiesSummary,
    fetchSalesPerformance,
  } = useDashboardActions();

  useEffect(() => {
    // Fetch all dashboard data on component mount
    fetchOverview();
    fetchPipelineMetrics();
    fetchActivitiesSummary();
    fetchSalesPerformance();
    //fetchContractsExpiring();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={`Failed to load dashboard data: ${error}`}
        type="error"
        showIcon
      />
    );
  }

  return (
    <DashboardProvider>
      <div style={{ padding: "24px" }}>
        <Title level={2} style={{ marginBottom: "24px" }}>
          Sales Dashboard
        </Title>

        {/* Key Metrics */}
        <DashboardMetrics
          overview={overview}
          activitiesSummary={activitiesSummary}
        />

        <Row gutter={[16, 16]}>
          {/* Pipeline Overview */}
          <Col xs={24} lg={12}>
            <Card title="Pipeline Overview" hoverable>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Opportunities: {overview?.opportunities?.totalCount ?? 0}</p>
                <p>
                  Pipeline Value: {overview?.opportunities?.pipelineValue ?? 0}{" "}
                  ZAR
                </p>
                <p>Win Rate: {overview?.opportunities?.winRate ?? 0}%</p>
              </div>
            </Card>
          </Col>

          {/* Sales Performance */}
          <Col xs={24} lg={12}>
            <Card title="Sales Performance" hoverable>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>This Month: {overview?.revenue?.thisMonth ?? 0} ZAR</p>
                <p>This Quarter: {overview?.revenue?.thisQuarter ?? 0} ZAR</p>
                <p>This Year: {overview?.revenue?.thisYear ?? 0} ZAR</p>
              </div>
            </Card>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          {/* Activities Summary */}
          <Col xs={24} lg={12}>
            <Card title="Activities Summary" hoverable>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Upcoming: {activitiesSummary?.upcomingActivities ?? 0}</p>
                <p>Completed: {activitiesSummary?.completedActivities ?? 0}</p>
                <p>Overdue: {activitiesSummary?.overdueActivities ?? 0}</p>
              </div>
            </Card>
          </Col>

          {/* Contracts Expiring */}
          <Col xs={24} lg={12}>
            <Card title="Contracts Expiring Soon" hoverable>
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p>
                  Total Active: {overview?.contracts?.totalActiveCount ?? 0}
                </p>
                <p>
                  Expiring This Month:{" "}
                  {overview?.contracts?.expiringThisMonthCount ?? 0}
                </p>
                <p>
                  Total Value: {overview?.contracts?.totalContractValue ?? 0}{" "}
                  ZAR
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage;
