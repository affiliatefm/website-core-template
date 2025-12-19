import opportunities from "../data/network-opportunities.json" assert { type: "json" };
import performance from "../data/performance-insights.json" assert { type: "json" };

export type Opportunity = {
  id: number;
  program: string;
  network: string;
  vertical: string;
  avgCpa: number;
  approvalTimeDays: number;
  topGeo: string;
  signals: string;
};

export type PerformancePoint = {
  month: string;
  ctr: number;
  epc: number;
  conversionRate: number;
  clicks: number;
  topRegion: string;
};

const opportunityData = opportunities as Opportunity[];
const performanceData = performance as PerformancePoint[];

export function getTopOpportunities(limit = 3): Opportunity[] {
  return [...opportunityData]
    .sort((a, b) => b.avgCpa - a.avgCpa)
    .slice(0, limit);
}

export function getPerformanceTrend(): PerformancePoint[] {
  return performanceData;
}

export function getDataSummary() {
  const avgCpa = opportunityData.reduce((sum, item) => sum + item.avgCpa, 0) / opportunityData.length;
  const fastestApproval = Math.min(...opportunityData.map((item) => item.approvalTimeDays));
  const bestCtr = Math.max(...performanceData.map((item) => item.ctr));

  return {
    avgCpa: Number(avgCpa.toFixed(2)),
    fastestApproval,
    bestCtr,
    sampleSize: opportunityData.length
  };
}
