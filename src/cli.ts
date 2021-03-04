#!/usr/bin/env node

import path from 'path';
import minimist from 'minimist';
import { lightkeeper } from '.';
import { Device } from './lighthouse_config';
import { LightkeeperConfig } from './config';

type Argv = {
  url: string;
  device: Device;
  config: string;
};

async function main(): Promise<void> {
  const argv = (minimist(process.argv.slice(2), {
    string: ['url', 'device', 'config'],
  }) as unknown) as Argv;
  const configPath = path.resolve(process.cwd(), argv.config);
  const config = (await import(configPath)) as LightkeeperConfig;

  const result = await lightkeeper({
    url: argv.url,
    device: argv.device,
    runs: config.runs,
    aggregate: config.aggregate,
    metricConfigs: config.metrics,
    lighthouseFlags: config.lighthouse?.flags,
    lighthouseConfig: config.lighthouse?.config,
  });

  console.log(JSON.stringify(result));
}

main().catch(console.error);
