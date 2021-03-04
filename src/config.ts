import { MetricConfig } from './metrics';

export type LightkeeperConfig = {
  runs: number;
  aggregate: boolean;
  lighthouse?: {
    flags: unknown;
    config: unknown;
  };
  metrics: MetricConfig[];
};
