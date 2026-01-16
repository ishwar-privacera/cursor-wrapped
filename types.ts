export interface CsvRow {
  Date: string;
  User: string;
  Kind: string;
  Model: string;
  "Max Mode": string;
  "Input (w/ Cache Write)": string;
  "Input (w/o Cache Write)": string;
  "Cache Read": string;
  "Output Tokens": string;
  "Total Tokens": string;
  Cost: string;
}

export interface UsageStats {
  totalRequests: number;
  totalCost: number;
  totalTokens: number;
  mostUsedModel: { name: string; count: number };
  topKind: { name: string; count: number };
  costByModel: { name: string; value: number }[];
  usageOverTime: { date: string; tokens: number; cost: number }[];
  mostProductiveDay: string; // e.g., "Tuesday"
  averageCostPerRequest: number;
  tokenDistribution: { name: string; value: number }[];
}

export enum AppState {
  UPLOAD = 'UPLOAD',
  PROCESSING = 'PROCESSING',
  STORY = 'STORY',
  DASHBOARD = 'DASHBOARD'
}