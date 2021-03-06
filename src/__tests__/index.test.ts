import jsonpath from 'jsonpath';

import { lightkeeper } from '../index';

test('device: mobile lets Lightkeeper use the mobile configuration', async () => {
  const results = await lightkeeper({
    url: 'https://example.com',
    device: 'mobile',
    runs: 1,
    aggregate: false,
    metricConfigs: [
      {
        name: 'user-agent',
        query: "$['environment']['networkUserAgent']",
      },
    ],
    lighthouseFlags: {},
    lighthouseConfig: {
      settings: {
        onlyAudits: ['first-contentful-paint'],
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userAgent = jsonpath.query(
    results,
    "$..[?(@['name']=='user-agent')]['value']",
  )[0];

  expect(userAgent).toEqual(expect.stringContaining('Mobile'));
});

test('device: desktop lets Lightkeeper use the desktop configuration', async () => {
  const results = await lightkeeper({
    url: 'https://example.com',
    device: 'desktop',
    runs: 1,
    aggregate: false,
    metricConfigs: [
      {
        name: 'user-agent',
        query: "$['environment']['networkUserAgent']",
      },
    ],
    lighthouseFlags: {},
    lighthouseConfig: {
      settings: {
        onlyAudits: ['first-contentful-paint'],
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const userAgent = jsonpath.query(
    results,
    "$..[?(@['name']=='user-agent')]['value']",
  )[0];

  expect(userAgent).toEqual(expect.not.stringContaining('Mobile'));
});

test('aggregate: false prints results of each run', async () => {
  const results = await lightkeeper({
    url: 'https://example.com',
    device: 'desktop',
    runs: 3,
    aggregate: false,
    metricConfigs: [
      {
        name: 'first-contentful-paint',
        query: "$['audits']['first-contentful-paint']['numericValue']",
      },
    ],
    lighthouseFlags: {},
    lighthouseConfig: {
      settings: {
        onlyAudits: ['first-contentful-paint'],
      },
    },
  });

  expect(results).toHaveProperty('results');
  expect(Array.isArray(results.results)).toBeTruthy();
  expect(results.results[0]).toHaveProperty('metrics');
  expect(results).not.toHaveProperty('aggregated');

  const values = jsonpath.query(
    results,
    "$..[?(@['name']=='first-contentful-paint')]['value']",
  );

  expect(values).toHaveLength(3);
  expect(values[0]).toBeGreaterThan(0);
  expect(values[1]).toBeGreaterThan(0);
  expect(values[2]).toBeGreaterThan(0);
});

test('aggregate: true prints aggregated result of runs', async () => {
  const results = await lightkeeper({
    url: 'https://example.com',
    device: 'desktop',
    runs: 3,
    aggregate: true,
    metricConfigs: [
      {
        name: 'first-contentful-paint',
        query: "$['audits']['first-contentful-paint']['numericValue']",
      },
    ],
    lighthouseFlags: {},
    lighthouseConfig: {
      settings: {
        onlyAudits: ['first-contentful-paint'],
      },
    },
  });

  expect(results).toHaveProperty('results');
  expect(Array.isArray(results.results)).toBeTruthy();
  expect(results.results[0]).toHaveProperty('metrics');
  expect(results).toHaveProperty('aggregated');

  const values = jsonpath.query(
    results,
    "$['aggregated'][?(@['name']=='first-contentful-paint')]['value']",
  );

  expect(values).toHaveLength(1);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const stats = values[0];

  expect(stats).toHaveProperty('min');
  expect(stats).toHaveProperty('max');
  expect(stats).toHaveProperty('sum');
  expect(stats).toHaveProperty('mean');
  expect(stats).toHaveProperty('median');
  expect(stats).toHaveProperty('variance');
  expect(stats).toHaveProperty('standardDeviation');
});
