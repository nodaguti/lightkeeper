import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import {
  Device,
  generateLighthouseConfig,
  generateLighthouseFlagsSettings,
  LighthouseFlagsSettings,
  LighthouseConfig,
} from './lighthouse_config';
import { extractMetrics, MetricConfig } from './metrics';

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
}): Promise<void> {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

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

    console.log(metrics);
  } finally {
    await chrome.kill();
  }
}
