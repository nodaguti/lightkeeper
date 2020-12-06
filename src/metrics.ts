import jsonpath from 'jsonpath';

type JSONPathExpression = string;

export type MetricConfig = {
  name: string;
  query: JSONPathExpression;
};

export type Metric = {
  name: string;
  value: string | number;
};

export function extractMetrics(
  lighthouseResult: unknown,
  metrics: MetricConfig[],
): Metric[] {
  return metrics
    .map((metricConfig) => {
      const node = jsonpath.query(lighthouseResult, metricConfig.query);

      if (node.length === 0) {
        console.warn(`WARN: ${metricConfig.query} didn't match anything.`);
        return undefined;
      }

      if (node.length > 1) {
        console.warn(
          `WARN: ${metricConfig.query} matched multiple objects. Only first one will be used.`,
        );
      }

      return {
        name: metricConfig.name,
        value: node[0],
      };
    })
    .filter((v) => v !== undefined);
}
