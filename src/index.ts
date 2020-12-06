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

export type LightkeeperResult = {
  metrics: Metric[];
};

export async function lightkeeper({
  url,
  device,
  metricConfigs,
  lighthouseFlags,
  lighthouseConfig,
}: {
  url: string;
  device: Device;
  metricConfigs: MetricConfig[];
  lighthouseFlags: LighthouseFlagsSettings;
  lighthouseConfig: LighthouseConfig;
}): Promise<LightkeeperResult> {
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
    const runnerResult = await lighthouse(url, settings, config);
    const metrics = extractMetrics(runnerResult.lhr, metricConfigs);

    return { metrics };
  } finally {
    await chrome.kill();
  }
}
