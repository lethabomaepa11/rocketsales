// Dashboard Types from API Documentation

export interface OpportunityMetrics {
  totalCount: number;
  wonCount: number;
  winRate: number;
  pipelineValue: number;
}

export interface PipelineStage {
  stage: number;
  stageName: string;
  count: number;
  totalValue: number;
  weightedValue: number;
}

export interface PipelineData {
  stages: PipelineStage[];
  weightedPipelineValue: number;
}

export interface ActivityMetrics {
  upcomingCount: number;
  overdueCount: number;
  completedTodayCount: number;
}

export interface ContractMetrics {
  totalActiveCount: number;
  expiringThisMonthCount: number;
  totalContractValue: number;
}

export interface MonthlyTrend {
  month: string;
  value: number;
}

export interface RevenueMetrics {
  thisMonth: number;
  thisQuarter: number;
  thisYear: number;
  monthlyTrend: MonthlyTrend[];
}

export interface DashboardOverviewDto {
  opportunities: OpportunityMetrics;
  pipeline: PipelineData;
  activities: ActivityMetrics;
  contracts: ContractMetrics;
  revenue: RevenueMetrics;
}

export interface PipelineMetricsDto {
  stages: PipelineStage[];
  weightedPipelineValue: number;
  totalOpportunities: number;
  winRate: number;
}

export interface StageActivityCount {
  type: string;
  typeName: string;
  scheduled: number;
  completed: number;
  overdue: number;
}

export interface ActivitiesSummaryDto {
  totalActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  overdueActivities: number;
  activityCounts: StageActivityCount[];
}

export interface SalesPerformanceDto {
  userId: string;
  userName: string;
  totalSales: number;
  salesGrowth: number;
  dealsWon: number;
  dealsLost: number;
  averageDealValue: number;
  conversionRate: number;
}

export interface ContractExpiryDto {
  id: string;
  contractNumber: string | null;
  clientName: string | null;
  title: string | null;
  endDate: string;
  daysUntilExpiry: number;
  contractValue: number;
}
