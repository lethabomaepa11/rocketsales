"use client";

import { useCallback, useState } from "react";
import { App } from "antd";
import { generatePDF, downloadPDF, PDFDocumentData } from "@/utils/pdfGenerator";
import { useDashboardState, useDashboardActions } from "@/providers/dashboardProvider";
import { useReportState, useReportActions } from "@/providers/reportProvider";
import dayjs from "dayjs";

export const useReportPDF = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { notification } = App.useApp();
  
  const dashboardState = useDashboardState();
  const reportState = useReportState();
  const { fetchOverview, fetchSalesPerformance, fetchActivitiesSummary } = useDashboardActions();
  const { fetchOpportunityReport, fetchSalesByPeriod } = useReportActions();

  const fetchAllReportData = useCallback(async () => {
    await Promise.all([
      fetchOverview(),
      fetchSalesPerformance(),
      fetchActivitiesSummary(),
      fetchOpportunityReport(),
      fetchSalesByPeriod({ groupBy: "month" }),
    ]);
  }, [fetchOverview, fetchSalesPerformance, fetchActivitiesSummary, fetchOpportunityReport, fetchSalesByPeriod]);

  const buildPDFData = useCallback((): PDFDocumentData => {
    const { overview, salesPerformance, activitiesSummary } = dashboardState;
    const { opportunityReport, salesByPeriod } = reportState;

    const formatCurrency = (value: number) => 
      `R ${(value || 0).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}`;

    const sections: PDFDocumentData["sections"] = [
      {
        type: "heading",
        content: "Executive Summary",
      },
      {
        type: "paragraph",
        content: `This report provides a comprehensive overview of sales performance, including revenue metrics, opportunity analysis, and activity tracking. Data is current as of ${new Date().toLocaleDateString()}.`,
      },
      { type: "separator" },
      {
        type: "heading",
        content: "Key Performance Indicators",
      },
      {
        type: "table",
        headers: ["Metric", "Value"],
        rows: [
          ["Total Revenue (Year)", formatCurrency(overview?.revenue?.thisYear || 0)],
          ["Win Rate", `${overview?.opportunities?.winRate || 0}%`],
          ["Total Opportunities", String(overview?.opportunities?.totalCount || 0)],
          ["Completed Activities", String(activitiesSummary?.completedActivities || 0)],
        ],
      },
    ];

    if (salesPerformance && salesPerformance.length > 0) {
      const repCount = salesPerformance.length;
      const summary = salesPerformance.reduce(
        (acc, item) => ({
          dealsWon: acc.dealsWon + item.dealsWon,
          dealsLost: acc.dealsLost + item.dealsLost,
          avgValue: acc.avgValue + (item.averageDealValue || 0) / repCount,
          avgRate: acc.avgRate + (item.conversionRate || 0) / repCount,
        }),
        { dealsWon: 0, dealsLost: 0, avgValue: 0, avgRate: 0 }
      );

      sections.push({ type: "separator" });
      sections.push({ type: "heading", content: "Sales Performance" });
      sections.push({
        type: "table",
        headers: ["Metric", "Value"],
        rows: [
          ["Deals Won", String(summary.dealsWon)],
          ["Deals Lost", String(summary.dealsLost)],
          ["Average Deal Value", formatCurrency(summary.avgValue)],
          ["Average Conversion Rate", `${summary.avgRate.toFixed(1)}%`],
        ],
      });
    }

    if (opportunityReport && opportunityReport.length > 0) {
      sections.push({ type: "separator" });
      sections.push({ type: "heading", content: "Opportunities Overview" });
      sections.push({
        type: "paragraph",
        content: `Total active opportunities: ${opportunityReport.length}`,
      });
      
      const topOpps = [...opportunityReport]
        .sort((a, b) => (b.estimatedValue || 0) - (a.estimatedValue || 0))
        .slice(0, 10);
      
      sections.push({
        type: "table",
        headers: ["Title", "Client", "Value", "Stage", "Probability"],
        rows: topOpps.map((opp) => [
          opp.title || "Untitled",
          opp.clientName || "—",
          formatCurrency(opp.estimatedValue || 0),
          getStageLabel(opp.stage),
          `${opp.probability || 0}%`,
        ]),
      });
    }

    if (salesByPeriod && salesByPeriod.length > 0) {
      sections.push({ type: "separator" });
      sections.push({ type: "heading", content: "Sales by Period" });
      sections.push({
        type: "table",
        headers: ["Period", "Revenue", "Deals"],
        rows: salesByPeriod.map((item) => [
          item.period,
          formatCurrency(item.totalValue || 0),
          String(item.count || 0),
        ]),
      });
    }

    sections.push({ type: "separator" });
    sections.push({ type: "heading", content: "Activities Summary" });
    sections.push({
      type: "table",
      headers: ["Metric", "Value"],
      rows: [
        ["Total Activities", String(activitiesSummary?.totalActivities || 0)],
        ["Upcoming", String(activitiesSummary?.upcomingActivities || 0)],
        ["Overdue", String(activitiesSummary?.overdueActivities || 0)],
        ["Completed", String(activitiesSummary?.completedActivities || 0)],
      ],
    });

    sections.push({ type: "separator" });
    sections.push({
      type: "paragraph",
      content: "Report generated by RocketSales AI. For more detailed analysis, please contact your sales administrator.",
    });

    return {
      title: "Sales Report",
      subtitle: "Comprehensive Business Overview",
      date: new Date().toLocaleDateString(),
      sections,
    };
  }, [dashboardState, reportState]);

  const generateReportPDF = useCallback(async () => {
    setIsGenerating(true);
    try {
      await fetchAllReportData();
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const pdfData = buildPDFData();
      const pdfUri = generatePDF(pdfData);
      const fileName = `RocketSales_Report_${dayjs().format("YYYY-MM-DD")}`;
      downloadPDF(pdfUri, fileName);
      
      notification.success({ message: "PDF report downloaded successfully" });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      notification.error({ message: "Failed to generate PDF report" });
    } finally {
      setIsGenerating(false);
    }
  }, [fetchAllReportData, buildPDFData, notification]);

  return {
    generateReportPDF,
    isGenerating,
    fetchAllReportData,
  };
};

function getStageLabel(stage: number): string {
  const stages: Record<number, string> = {
    1: "Lead",
    2: "Qualified",
    3: "Proposal",
    4: "Negotiation",
    5: "Closed Won",
    6: "Closed Lost",
  };
  return stages[stage] || String(stage);
}
