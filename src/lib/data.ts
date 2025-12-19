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

const opportunityData: Opportunity[] = [];
const performanceData: PerformancePoint[] = [];

export function getTopOpportunities(limit = 3): Opportunity[] {
  return opportunityData.slice(0, limit);
}

export function getPerformanceTrend(): PerformancePoint[] {
  return performanceData;
}

export function getDataSummary() {
  return {
    avgCpa: 0,
    fastestApproval: 0,
    bestCtr: 0,
    sampleSize: opportunityData.length,
  };
}
