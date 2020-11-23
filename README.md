# Lightkeeper

> A synthetic monitoring and analysis tool built on top of Lighthouse

## Installation

```
$ yarn add --global lightkeeper
```

## Usages

### Gather metrics

```
$ lightkeeper --url=https://example.com --device=<'mobile'|'desktop'> --config=/path/to/config.json
```

### Statistically compare metrics of multiple websites

(Under development)

### Visualise historical metrics

(Under development)

## Configuration

### config.json

```json
{
  "lighthouse": {
    "flags": {},
    "config": {
      "settings": {
        "skipAudits": ["screenshot-thumbnails", "final-screenshot"]
      }
    }
  },
  "metrics": [
    {
      "name": "largest-contentful-paint",
      "query": "$['audits']['largest-contentful-paint']['numericValue']"
    },
    {
      "name": "total-blocking-time",
      "query": "$['audits']['total-blocking-time']['numericValue']"
    },
    {
      "name": "cumulative-layout-shift",
      "query": "$['audits']['cumulative-layout-shift']['numericValue']"
    },
    {
      "name": "user-timing-foo",
      "query": "$['audits']['user-timings']['details']['items'][?(@['name']=='foo')]['startTime']"
    }
  ]
}
```

#### lighthouse.flags

This object is passed to the second argument of `lighthouse()`. The available flags can be found in [Lighthouse's document](https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#differences-from-cli-flags).

#### lighthouse.config

This object is passed to the third argument of `lighthouse()`. See [Lighthouse's document](https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#configuration) for the full list of available options.

#### metrics

A list of metrics that will be extracted from a Lighthouse output.

`query` is a [JSONPath](https://github.com/dchester/jsonpath#readme) expression that tells Lightkeeper how to get a metric from a Lighthouse result. You can find the type definition of the result object in [Lighthouse's typedefs](https://github.com/GoogleChrome/lighthouse/blob/378a31f8117d20c852562514612c80ea12892c54/types/lhr.d.ts#L27).
