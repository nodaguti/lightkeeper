#!/usr/bin/env node

import path from 'path';
import minimist from 'minimist';
import { lightkeeper } from '.';

async function main(): Promise<void> {
  const argv = minimist(process.argv.slice(2), {
    string: ['url', 'device', 'config'],
  });
  const configPath = path.resolve(process.cwd(), argv.config);
  const config = await import(configPath);

  const result = await lightkeeper({
    url: argv.url,
    device: argv.device,
    metricConfigs: config.metrics,
    lighthouseFlags: config.lighthouse?.flags,
    lighthouseConfig: config.lighthouse?.config,
  });

  console.log(JSON.stringify(result));
}

main().catch(console.error);
