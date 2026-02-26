export interface ReportOpportunityParams {
  startDate?: string;
  endDate?: string;
  stage?: number;
  ownerId?: string;
}

export interface SalesByPeriodParams {
  startDate?: string;
  endDate?: string;
  groupBy?: "month" | "week";
}

export interface OpportunityReportItem {
  id: string;
  title: string;
  clientName: string;
  ownerName: string;
  estimatedValue: number;
  stage: number;
  stageName: string;
  probability: number;
  expectedCloseDate: string | null;
  createdAt: string;
}

export interface SalesByPeriodItem {
  period: string;
  totalValue: number;
  count: number;
}