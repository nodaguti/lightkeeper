import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import {
  Device,
  generateLighthouseConfig,
  generateLighthouseFlagsSettings,
  LighthouseFlagsSettings,
  LighthouseConfig,
} from './lighthouse_config';
import { extractMetrics, MetricConfig, Metric } from './metrics';
import { AggregatedMetric, aggregateResults } from './aggregation';

type LightkeeperResult = {
  metrics: Metric[];
};

export type LightkeeperResults = {
  results: LightkeeperResult[];
  aggregated?: AggregatedMetric[];
};

export async function lightkeeper({
  url,
  device,
  runs,
  aggregate,
  metricConfigs,
  lighthouseFlags,
  lighthouseConfig,
}: {
  url: string;
  device: Device;
  runs: number;
  aggregate?: boolean;
  metricConfigs: MetricConfig[];
  lighthouseFlags?: LighthouseFlagsSettings;
  lighthouseConfig?: LighthouseConfig;
}): Promise<LightkeeperResults> {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox'],
  });

  try {
    const settings = generateLighthouseFlagsSettings({
      device,
      port: chrome.port,
      userSettings: lighthouseFlags,
    });
    const config = generateLighthouseConfig({
      userConfig: lighthouseConfig,
    });

    const results: LightkeeperResult[] = [];

    for (let i = 0; i < runs; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const runnerResult = (await lighthouse(url, settings, config)) as {
        lhr: unknown;
      };
      const metrics = extractMetrics(runnerResult.lhr, metricConfigs);

      results.push({ metrics });
    }

    if (aggregate === true) {
      const aggregatedResults = aggregateResults({ results });
      return { results, aggregated: aggregatedResults };
    }

    return { results };
  } finally {
    await chrome.kill();
  }
}
