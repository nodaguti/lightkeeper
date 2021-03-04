import merge from 'deepmerge';
import desktopConfig from 'lighthouse/lighthouse-core/config/desktop-config';

export type Device = 'desktop' | 'mobile';
export type LighthouseFlagsSettings = unknown;
export type LighthouseConfig = unknown;

type LighthouseDesktopConfig = {
  settings: unknown;
};

export function generateLighthouseFlagsSettings({
  device,
  port,
  userSettings,
}: {
  device: Device;
  port: number;
  userSettings: LighthouseFlagsSettings;
}): LighthouseFlagsSettings {
  const baseSettings = {
    logLevel: 'error',
    output: 'json',
    onlyCategories: ['performance'],
    port,
  };

  // The default settings of Lighthouse emulates a mobile device with slow 4G connection
  const deviceEmulationSettings =
    device === 'mobile'
      ? {}
      : (desktopConfig as LighthouseDesktopConfig).settings;

  const merged = merge.all([
    baseSettings,
    deviceEmulationSettings,
    userSettings,
  ]);

  return merged;
}

export function generateLighthouseConfig({
  userConfig,
}: {
  userConfig: LighthouseConfig;
}): LighthouseConfig {
  const baseConfig = {
    extends: 'lighthouse:default',
  };
  const merged = merge.all([baseConfig, userConfig]);

  return merged;
}
