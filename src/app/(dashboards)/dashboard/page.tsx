"use client";

import { useState, useEffect } from "react";
import { Card, Spin, Alert, Typography, Button, Table, Tag, Space } from "antd";
import {
  DashboardProvider,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useDashboardState } from "@/providers/dashboardProvider";
import DashboardMetrics from "@/components/dashboards/dashboard/DashboardMetrics";
import InviteUserModal from "@/components/common/InviteUserModal";
import {
  RevenueTrendChart,
  PipelineFunnelChart,
  SalesPerformanceChart,
  ActivityChart,
} from "@/components/dashboards/charts";
import { UserAddOutlined } from "@ant-design/icons";
import { useStyles } from "./style/page.style";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { styles } = useStyles();
  const router = useRouter();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
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
    fetchExpiringContracts,
  } = useDashboardActions();

  const [isDismissed, setIsDismissed] = useState(false);
  const showExpiringAlert =
    !isDismissed && contractsExpiring && contractsExpiring.length > 0;

  useEffect(() => {
    fetchOverview();
    fetchPipelineMetrics();
    fetchActivitiesSummary();
    fetchSalesPerformance();
    fetchExpiringContracts();
  }, []);

  const handleRenewContract = (contractId: string) => {
    router.push(`/contracts?renew=${contractId}`);
  };

  const handleViewContracts = () => {
    router.push("/contracts?filter=expiring");
  };

  const expiringColumns = [
    {
      title: "Contract",
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (text: string, record: any) => (
        <Space direction="vertical" size={0}>
          <Text strong>{text || "N/A"}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.clientName}
          </Text>
        </Space>
      ),
    },
    {
      title: "Value",
      dataIndex: "contractValue",
      key: "contractValue",
      render: (value: number, record: any) =>
        value ? `${record.currency || "R"} ${value.toLocaleString()}` : "-",
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (date: string) =>
        date ? dayjs(date).format("DD MMM YYYY") : "N/A",
    },
    {
      title: "Days Left",
      dataIndex: "daysUntilExpiry",
      key: "daysUntilExpiry",
      render: (days: number) => (
        <Tag color={days <= 7 ? "red" : days <= 30 ? "orange" : "default"}>
          {days} days
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleRenewContract(record.id)}>
          Renew
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className={styles.loadingState}>
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
      <div className={styles.pageContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Title level={2} className={styles.pageTitle} style={{ margin: 0 }}>
            Sales Dashboard
          </Title>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setInviteModalOpen(true)}
          >
            Invite Team Member
          </Button>
        </div>

        {/* Expiring Contracts Alert */}
        {showExpiringAlert &&
          contractsExpiring &&
          contractsExpiring.length > 0 && (
            <Card style={{ marginBottom: 16, borderColor: "#ff4d4f" }} bordered>
              <Alert
                message={`${contractsExpiring.length} Contract${contractsExpiring.length > 1 ? "s" : ""} Expiring Soon`}
                description={
                  <div>
                    <Text>
                      You have {contractsExpiring.length} contract
                      {contractsExpiring.length > 1 ? "s" : ""} expiring within
                      the next 30 days. Please review and renew them to maintain
                      customer relationships.
                    </Text>
                    <div style={{ marginTop: 12 }}>
                      <Button
                        type="primary"
                        onClick={handleViewContracts}
                        style={{ marginRight: 8 }}
                      >
                        View All Expiring Contracts
                      </Button>
                      <Button onClick={() => setIsDismissed(true)}>
                        Dismiss
                      </Button>
                    </div>
                    {contractsExpiring.length <= 5 && (
                      <div style={{ marginTop: 16 }}>
                        <Table
                          dataSource={contractsExpiring}
                          columns={expiringColumns}
                          rowKey="id"
                          pagination={false}
                          size="small"
                        />
                      </div>
                    )}
                  </div>
                }
                type="warning"
                showIcon
              />
            </Card>
          )}

        {/* Key Metrics */}
        <DashboardMetrics
          overview={overview}
          activitiesSummary={activitiesSummary}
        />

        {/* Revenue Trend Chart */}
        <div style={{ marginTop: 16 }}>
          <RevenueTrendChart
            monthlyTrend={overview?.revenue?.monthlyTrend}
            loading={loading}
            title="Revenue Trend Analysis"
          />
        </div>

        {/* Pipeline Funnel Chart */}
        <div style={{ marginTop: 16 }}>
          <PipelineFunnelChart
            stages={pipelineMetrics?.stages}
            loading={loading}
            title="Pipeline Funnel Analysis"
          />
        </div>

        {/* Sales Performance Chart */}
        <div style={{ marginTop: 16 }}>
          <SalesPerformanceChart
            salesPerformance={salesPerformance}
            loading={loading}
            title="Sales Team Performance"
          />
        </div>

        {/* Activity Chart */}
        <div style={{ marginTop: 16 }}>
          <ActivityChart
            activitiesSummary={activitiesSummary}
            loading={loading}
            title="Activity Overview"
          />
        </div>

        <InviteUserModal
          open={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
        />
      </div>
    </DashboardProvider>
  );
};

export default DashboardPage;
