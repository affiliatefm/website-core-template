#!/usr/bin/env node
import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src/data");
await fs.mkdir(dataDir, { recursive: true });

const programs = [
  { program: "FinEdge Global", network: "Impact Radius", vertical: "Finance" },
  { program: "Atlas SaaS", network: "PartnerStack", vertical: "B2B SaaS" },
  { program: "Nomad Gear", network: "CJ", vertical: "E-commerce" },
  { program: "SolarCollective", network: "ShareASale", vertical: "Sustainability" },
  { program: "RevMax Studio", network: "Everflow", vertical: "Gaming" }
];

function randomBetween(min, max, decimals = 0) {
  const num = Math.random() * (max - min) + min;
  return Number(num.toFixed(decimals));
}

const opportunityPayload = programs.map((item, index) => ({
  ...item,
  id: index + 1,
  avgCpa: randomBetween(45, 120),
  approvalTimeDays: randomBetween(2, 7, 1),
  topGeo: ["US", "UK", "DE", "CA", "AU"][index % 5],
  signals: ["High EPC", "Fresh creative", "Data API access", "Auto-approvals"][index % 4]
}));

const now = new Date();
const months = Array.from({ length: 6 }).map((_, idx) => {
  const date = new Date(now);
  date.setMonth(now.getMonth() - idx);
  return date.toLocaleString("en-US", { month: "short" });
});

const performancePayload = months.map((month, idx) => ({
  month,
  ctr: randomBetween(2.1, 4.5, 2),
  epc: randomBetween(1.2, 3.8, 2),
  conversionRate: randomBetween(1.5, 3.6, 2),
  clicks: randomBetween(1200, 4200),
  topRegion: ["NA", "EU", "APAC", "LATAM"][idx % 4]
})).reverse();

await fs.writeFile(
  path.join(dataDir, "network-opportunities.json"),
  JSON.stringify(opportunityPayload, null, 2) + "\n"
);
await fs.writeFile(
  path.join(dataDir, "performance-insights.json"),
  JSON.stringify(performancePayload, null, 2) + "\n"
);

console.log(`Seeded ${opportunityPayload.length} affiliate opportunities and ${performancePayload.length} monthly insights.`);
