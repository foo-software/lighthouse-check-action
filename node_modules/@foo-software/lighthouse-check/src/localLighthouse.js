import get from 'lodash.get';
import path from 'path';
import lighthousePersist from '@foo-software/lighthouse-persist';
import lighthouseDefaultConfig, { throttling } from './lighthouseConfig';
import { NAME } from './constants';

const getScoresFromFloat = scores =>
  Object.keys(scores).reduce(
    (accumulator, current) => ({
      ...accumulator,
      [current]:
        typeof scores[current] !== 'number'
          ? 0
          : Math.floor(scores[current] * 100)
    }),
    {}
  );

const options = {
  chromeFlags: [
    '--disable-dev-shm-usage',
    '--headless',
    '--no-sandbox',
    '--ignore-certificate-errors'
  ]
};

export const localLighthouse = async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  locale,
  outputDirectory,
  throttling: throttlingOverride,
  throttlingMethod,
  url
}) => {
  // the default config combined with overriding query params
  const fullConfig = {
    ...lighthouseDefaultConfig,
    settings: {
      ...lighthouseDefaultConfig.settings,
      ...(!throttlingMethod
        ? {}
        : {
            throttlingMethod
          }),
      ...(!throttlingOverride || !throttling[throttlingOverride]
        ? {}
        : {
            throttling: throttling[throttlingOverride]
          }),
      ...(!emulatedFormFactor
        ? {}
        : {
            emulatedFormFactor
          }),
      // if we wanted translations (holy!)
      // locale: 'ja',
      ...(!locale
        ? {}
        : {
            locale
          })
    }
  };

  const { localReport, report, result } = await lighthousePersist({
    awsAccessKeyId,
    awsBucket,
    awsRegion,
    awsSecretAccessKey,
    config: fullConfig,
    options,
    outputDirectory: !outputDirectory
      ? outputDirectory
      : path.resolve(outputDirectory),
    url
  });

  const scores = getScoresFromFloat({
    accessibility: get(result, 'categories.accessibility.score'),
    bestPractices: get(result, 'categories["best-practices"].score'),
    performance: get(result, 'categories.performance.score'),
    progressiveWebApp: get(result, 'categories.pwa.score'),
    seo: get(result, 'categories.seo.score')
  });

  return {
    url,
    localReport,
    report,
    scores
  };
};

export default async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  locale,
  outputDirectory,
  throttling,
  throttlingMethod,
  urls,
  verbose
}) => {
  const auditResults = [];
  let index = 1;

  for (const url of urls) {
    if (verbose) {
      console.log(`${NAME}: Auditing (${index}/${urls.length}) ${url}`);
    }

    const lighthouseAuditResult = await localLighthouse({
      awsAccessKeyId,
      awsBucket,
      awsRegion,
      awsSecretAccessKey,
      emulatedFormFactor,
      locale,
      outputDirectory,
      throttling,
      throttlingMethod,
      url
    });

    auditResults.push(lighthouseAuditResult);
    index++;
  }
  return auditResults;
};
