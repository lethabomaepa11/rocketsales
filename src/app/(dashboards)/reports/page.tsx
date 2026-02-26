"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  DatePicker,
  Typography,
  Select,
  Spin,
} from "antd";
import {
  BarChartOutlined,
  LineChartOutlined,
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
import { useReportState, useReportActions } from "@/providers/reportProvider";
import dayjs from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const stageMap: Record<number, { label: string; color: string }> = {
  1: { label: "Lead", color: "default" },
  2: { label: "Qualified", color: "blue" },
  3: { label: "Proposal", color: "cyan" },
  4: { label: "Negotiation", color: "orange" },
  5: { label: "Closed Won", color: "green" },
  6: { label: "Closed Lost", color: "red" },
};

const ReportsPage = () => {
  const { overview, salesPerformance, activitiesSummary } = useDashboardState();
  const { fetchOverview, fetchSalesPerformance, fetchActivitiesSummary } =
    useDashboardActions();
  const { opportunityReport, salesByPeriod, isPending } = useReportState();
  const { fetchOpportunityReport, fetchSalesByPeriod } = useReportActions();

  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [groupBy, setGroupBy] = useState<"month" | "week">("month");

  useEffect(() => {
    fetchOverview();
    fetchSalesPerformance();
    fetchActivitiesSummary();
    fetchOpportunityReport();
    fetchSalesByPeriod({ groupBy: "month" });
  }, []);

  const handleDateFilter = () => {
    const params = dateRange
      ? {
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
        }
      : {};
    fetchOpportunityReport(params);
    fetchSalesByPeriod({ ...params, groupBy });
  };

  useEffect(() => {
    if (dateRange) handleDateFilter();
  }, [dateRange, groupBy]);

  const oppColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Client", dataIndex: "clientName", key: "clientName" },
    { title: "Owner", dataIndex: "ownerName", key: "ownerName" },
    {
      title: "Value",
      dataIndex: "estimatedValue",
      key: "estimatedValue",
      render: (v: number) =>
        `R ${(v || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
      sorter: (a: { estimatedValue: number }, b: { estimatedValue: number }) =>
        a.estimatedValue - b.estimatedValue,
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (s: number) => {
        const info = stageMap[s] || { label: s, color: "default" };
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      title: "Probability",
      dataIndex: "probability",
      key: "probability",
      render: (p: number) => `${p}%`,
    },
    {
      title: "Expected Close",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      render: (d: string) => (d ? dayjs(d).format("DD MMM YYYY") : "—"),
    },
  ];

  const salesColumns = [
    { title: "Period", dataIndex: "period", key: "period" },
    {
      title: "Revenue",
      dataIndex: "totalValue",
      key: "totalValue",
      render: (v: number) =>
        `R ${(v || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`,
    },
    { title: "Deals", dataIndex: "count", key: "count" },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={3}>Reports &amp; Analytics</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue (Year)"
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
          <Card title="Sales Performance">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Deals Won"
                  value={salesPerformance?.dealsWon || 0}
                  prefix={<RiseOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Deals Lost"
                  value={salesPerformance?.dealsLost || 0}
                  prefix={<FallOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Conversion Rate"
                  value={salesPerformance?.conversionRate || 0}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Avg Deal Value"
                  value={salesPerformance?.averageDealValue || 0}
                  prefix={<DollarOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Activities Summary">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total"
                  value={activitiesSummary?.totalActivities || 0}
                  prefix={<BarChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Upcoming"
                  value={activitiesSummary?.upcomingActivities || 0}
                  prefix={<LineChartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Overdue"
                  value={activitiesSummary?.overdueActivities || 0}
                  prefix={<FallOutlined />}
                  valueStyle={{ color: "#cf1322" }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Completed"
                  value={activitiesSummary?.completedActivities || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#3f8600" }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Card
        title="Opportunities Report"
        style={{ marginBottom: 24 }}
        extra={
          <RangePicker
            onChange={(dates) =>
              setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
            }
          />
        }
      >
        <Spin spinning={isPending}>
          <Table
            dataSource={opportunityReport}
            columns={oppColumns}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </Card>

      <Card
        title="Sales by Period"
        extra={
          <Select
            value={groupBy}
            onChange={setGroupBy}
            style={{ width: 120 }}
            options={[
              { label: "Monthly", value: "month" },
              { label: "Weekly", value: "week" },
            ]}
          />
        }
      >
        <Spin spinning={isPending}>
          <Table
            dataSource={salesByPeriod}
            columns={salesColumns}
            rowKey="period"
            size="small"
            pagination={false}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default ReportsPage;
