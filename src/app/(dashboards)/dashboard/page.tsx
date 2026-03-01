"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Typography,
  Divider,
  Button,
  Table,
  Tag,
  Space,
} from "antd";
import {
  DashboardProvider,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import { useDashboardState } from "@/providers/dashboardProvider";
import DashboardMetrics from "@/components/dashboards/dashboard/DashboardMetrics";
import { useStyles } from "./style/page.style";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { styles } = useStyles();
  const router = useRouter();
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

  const [showExpiringAlert, setShowExpiringAlert] = useState(false);

  useEffect(() => {
    // Fetch all dashboard data on component mount
    fetchOverview();
    fetchPipelineMetrics();
    fetchActivitiesSummary();
    fetchSalesPerformance();
    fetchExpiringContracts();
  }, []);

  // Show alert when there are expiring contracts
  useEffect(() => {
    if (contractsExpiring && contractsExpiring.length > 0) {
      setShowExpiringAlert(true);
    }
  }, [contractsExpiring]);

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
        <Title level={2} className={styles.pageTitle}>
          Sales Dashboard
        </Title>

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
                      <Button onClick={() => setShowExpiringAlert(false)}>
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

        <Row gutter={[16, 16]}>
          {/* Pipeline Overview */}
          <Col xs={24} lg={12}>
            <Card title="Pipeline Overview" hoverable>
              <div className={styles.summaryCardContent}>
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
              <div className={styles.summaryCardContent}>
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
              <div className={styles.summaryCardContent}>
                <p>Upcoming: {activitiesSummary?.upcomingActivities ?? 0}</p>
                <p>Completed: {activitiesSummary?.completedActivities ?? 0}</p>
                <p>Overdue: {activitiesSummary?.overdueActivities ?? 0}</p>
              </div>
            </Card>
          </Col>

          {/* Contracts Expiring */}
          <Col xs={24} lg={12}>
            <Card title="Contracts Expiring Soon" hoverable>
              <div className={styles.summaryCardContent}>
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
