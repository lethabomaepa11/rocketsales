// Dashboard Types from API Documentation

export interface StageMetrics {
  stage: number;
  stageName: string | null;
  count: number;
  totalValue: number;
  weightedValue: number;
}

export interface DashboardOverviewDto {
  totalClients: number;
  totalOpportunities: number;
  totalContracts: number;
  activeProposals: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface PipelineMetricsDto {
  stageMetrics: {
    Lead?: StageMetrics;
    Qualified?: StageMetrics;
    Proposal?: StageMetrics;
    Negotiation?: StageMetrics;
    ClosedWon?: StageMetrics;
    ClosedLost?: StageMetrics;
  };
  totalPipelineValue: number;
  weightedPipelineValue: number;
  totalOpportunities: number;
  activeOpportunities: number;
  averageDealSize: number;
  winRate: number;
}

export interface SalesPerformanceDto {
  totalSales: number;
  salesGrowth: number;
  dealsWon: number;
  dealsLost: number;
  averageDealValue: number;
  conversionRate: number;
}

export interface ActivitiesSummaryDto {
  totalActivities: number;
  completedActivities: number;
  upcomingActivities: number;
  overdueActivities: number;
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
