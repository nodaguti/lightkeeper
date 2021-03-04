import { LightkeeperResults } from '.';
import { Metric } from './metrics';

export type AggregatedMetric = {
  name: string;
  value: {
    max: number;
    min: number;
    sum: number;
    mean: number;
    median: number;
    variance: number;
    standardDeviation: number;
  };
};

export function aggregateResults(
  results: LightkeeperResults,
): AggregatedMetric[] {
  const resultsGroupedByMetric: {
    [metricName: string]: Metric[];
  } = results.results.reduce(
    (acc: { [metricName: string]: Metric[] }, metrics) => {
      metrics.metrics.forEach((metric) => {
        if (acc[metric.name] === undefined) {
          acc[metric.name] = [];
        }

        acc[metric.name].push(metric);
      });

      return acc;
    },
    {},
  );
  const aggregatedMetrics: AggregatedMetric[] = Object.entries(
    resultsGroupedByMetric,
  ).map(([name, metrics]) => {
    const values = metrics
      .map(({ value }) => value)
      .filter(Number.isFinite) as number[];
    const stats = {
      max: max(values),
      min: min(values),
      sum: sum(values),
      mean: mean(values),
      median: median(values),
      variance: variance(values),
      standardDeviation: standardDeviation(values),
    };

    return {
      name,
      value: stats,
    };
  });

  return aggregatedMetrics;
}

function max(array: number[]): number {
  return Math.max(...array);
}

function min(array: number[]): number {
  return Math.min(...array);
}

function sum(array: number[]): number {
  return array.reduce((acc, value) => acc + value, 0);
}

function mean(array: number[]): number {
  return sum(array) / array.length;
}

function median(array: number[]): number {
  const sorted = array.concat().sort((a, b) => a - b);
  const mid = array.length / 2;
  return mid % 1 ? sorted[mid - 0.5] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function variance(array: number[]): number {
  const m = mean(array);
  return mean(array.map((num) => (num - m) ** 2));
}

function standardDeviation(array: number[]): number {
  return Math.sqrt(variance(array));
}
