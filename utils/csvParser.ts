import { CsvRow, UsageStats } from '../types';

export const parseCSV = (csvText: string): CsvRow[] => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCSVLine(lines[0]);

  const data: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].trim();
    if (!currentLine) continue;

    const values = parseCSVLine(currentLine);
    
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        // Remove quotes if present
        row[header] = values[index];
      });
      data.push(row as CsvRow);
    }
  }

  return data;
};

// Helper to handle commas inside quotes
const parseCSVLine = (text: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cleanValue(current));
      current = '';
    } else {
      current += char;
    }
  }
  result.push(cleanValue(current));
  return result;
};

const cleanValue = (val: string) => {
  return val.replace(/^"|"$/g, '').trim();
};

export const analyzeData = (data: CsvRow[]): UsageStats => {
  let totalCost = 0;
  let totalTokens = 0;
  const modelCounts: Record<string, number> = {};
  const kindCounts: Record<string, number> = {};
  const costByModel: Record<string, number> = {};
  const tokensByModel: Record<string, number> = {};
  const dateMap: Record<string, { tokens: number; cost: number }> = {};
  const dayCounts: Record<string, number> = {};

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  data.forEach(row => {
    // Parse numbers (remove commas if implied by locale, though specific csv format provided doesn't have commas in numbers, just quotes)
    const cost = parseFloat(row.Cost || '0');
    const tokens = parseInt(row["Total Tokens"] || '0', 10);
    const dateStr = row.Date;
    
    totalCost += cost;
    totalTokens += tokens;

    // Model Stats
    const model = row.Model || 'Unknown';
    modelCounts[model] = (modelCounts[model] || 0) + 1;
    costByModel[model] = (costByModel[model] || 0) + cost;
    tokensByModel[model] = (tokensByModel[model] || 0) + tokens;

    // Kind Stats
    const kind = row.Kind || 'Unknown';
    kindCounts[kind] = (kindCounts[kind] || 0) + 1;

    // Time Stats
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) {
          const dayName = days[date.getDay()];
          dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;

          const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          if (!dateMap[dateKey]) {
            dateMap[dateKey] = { tokens: 0, cost: 0 };
          }
          dateMap[dateKey].tokens += tokens;
          dateMap[dateKey].cost += cost;
        }
      } catch (e) {
        console.warn('Invalid date', dateStr);
      }
    }
  });

  // Sort Metrics
  const sortedModels = Object.entries(modelCounts).sort((a, b) => b[1] - a[1]);
  const mostUsedModel = sortedModels.length > 0 ? { name: sortedModels[0][0], count: sortedModels[0][1] } : { name: 'N/A', count: 0 };

  const sortedKinds = Object.entries(kindCounts).sort((a, b) => b[1] - a[1]);
  const topKind = sortedKinds.length > 0 ? { name: sortedKinds[0][0], count: sortedKinds[0][1] } : { name: 'N/A', count: 0 };

  const sortedDays = Object.entries(dayCounts).sort((a, b) => b[1] - a[1]);
  const mostProductiveDay = sortedDays.length > 0 ? sortedDays[0][0] : 'N/A';

  // Format charts
  const costByModelChart = Object.entries(costByModel)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);

  const usageOverTime = Object.entries(dateMap)
    .map(([date, stats]) => ({ date, tokens: stats.tokens, cost: parseFloat(stats.cost.toFixed(2)) }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const tokenDistribution = Object.entries(tokensByModel)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalRequests: data.length,
    totalCost: parseFloat(totalCost.toFixed(2)),
    totalTokens,
    mostUsedModel,
    topKind,
    costByModel: costByModelChart,
    usageOverTime,
    mostProductiveDay,
    averageCostPerRequest: data.length > 0 ? parseFloat((totalCost / data.length).toFixed(3)) : 0,
    tokenDistribution
  };
};