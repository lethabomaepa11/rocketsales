"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Select,
  DatePicker,
  Typography,
  message,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import {
  useDashboardState,
  useDashboardActions,
} from "@/providers/dashboardProvider";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const ReportsPage = () => {
  const { overview, salesPerformance, activitiesSummary, isPending } =
    useDashboardState();
  const { fetchOverview, fetchSalesPerformance, fetchActivitiesSummary } =
    useDashboardActions();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );

  useEffect(() => {
    fetchOverview();
    fetchSalesPerformance();
    fetchActivitiesSummary();
  }, []);

  const opportunityColumns = [
    { title: "Opportunity", dataIndex: "name", key: "name" },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (v: number) => `$${v.toLocaleString()}`,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (s: string) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (p: number) => `${p}%`,
    },
    {
      title: "Expected Close",
      dataIndex: "expectedClose",
      key: "expectedClose",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Reports & Analytics</Title>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={overview?.revenue?.thisYear || 0}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Win Rate"
              value={overview?.opportunities?.winRate || 0}
              suffix="%"
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Opportunities"
              value={overview?.opportunities?.totalCount || 0}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
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
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card
            title="Sales Performance"
            extra={
              <RangePicker
                onChange={(dates) =>
                  setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
                }
              />
            }
          >
            <Statistic
              title="Total Sales"
              value={salesPerformance?.totalSales || 0}
              prefix={<DollarOutlined />}
            />
            <Statistic
              title="Deals Won"
              value={salesPerformance?.dealsWon || 0}
              prefix={<RiseOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
            <Statistic
              title="Deals Lost"
              value={salesPerformance?.dealsLost || 0}
              prefix={<FallOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
            <Statistic
              title="Conversion Rate"
              value={salesPerformance?.conversionRate || 0}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Activities Summary">
            <Statistic
              title="Total Activities"
              value={activitiesSummary?.totalActivities || 0}
              prefix={<BarChartOutlined />}
            />
            <Statistic
              title="Upcoming"
              value={activitiesSummary?.upcomingActivities || 0}
              prefix={<LineChartOutlined />}
            />
            <Statistic
              title="Overdue"
              value={activitiesSummary?.overdueActivities || 0}
              prefix={<FallOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
      </Row>
      <Card title="Pipeline Overview">
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Total Pipeline Value"
              value={overview?.opportunities?.pipelineValue || 0}
              prefix={<DollarOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Total Contracts"
              value={overview?.contracts?.totalContractValue || 0}
              prefix={<FileTextOutlined />}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Weighted Pipeline"
              value={overview?.pipeline?.weightedPipelineValue || 0}
              prefix={<DollarOutlined />}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ReportsPage;
