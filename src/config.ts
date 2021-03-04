import { MetricConfig } from './metrics';

export type LightkeeperConfig = {
  runs: number;
  failFast?: boolean;
  aggregate?: boolean;
  lighthouse?: {
    flags: unknown;
    config: unknown;
  };
  metrics: MetricConfig[];
};
