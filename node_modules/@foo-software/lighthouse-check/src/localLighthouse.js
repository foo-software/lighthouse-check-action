import fs from 'fs';
import get from 'lodash.get';
import lighthousePersist from '@foo-software/lighthouse-persist';
import lighthouseDefaultConfig, { throttling } from './lighthouseConfig';
import options from './lighthouseOptions';
import writeResults from './helpers/writeResults';
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

export const localLighthouse = async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  extraHeaders,
  locale,
  maxWaitForLoad,
  outputDirectory,
  overrides,
  throttling: throttlingParam,
  throttlingMethod,
  url
}) => {
  // if desktop device, and no throttling param specified, use the
  // appropriate throttling
  const throttlingOverride =
    emulatedFormFactor === 'desktop' && !throttlingParam
      ? 'desktopDense4G'
      : throttlingParam;

  // the default config combined with overriding query params
  const fullConfig = {
    ...lighthouseDefaultConfig,
    settings: {
      ...lighthouseDefaultConfig.settings,
      ...(!maxWaitForLoad
        ? {}
        : {
            maxWaitForLoad
          }),
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
      ...(!extraHeaders
        ? {}
        : {
            extraHeaders
          }),
      // if we wanted translations (holy!)
      // locale: 'ja',
      ...(!locale
        ? {}
        : {
            locale
          })
    },
    ...(!overrides || !overrides.config
      ? {}
      : {
          ...overrides.config
        })
  };

  const { localReport, report, result } = await lighthousePersist({
    awsAccessKeyId,
    awsBucket,
    awsRegion,
    awsSecretAccessKey,
    config: fullConfig,
    options: {
      ...options,
      ...(!overrides || !overrides.options
        ? {}
        : {
            ...overrides.options
          })
    },
    outputDirectory,
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
    emulatedFormFactor,
    scores
  };
};

export default async ({
  awsAccessKeyId,
  awsBucket,
  awsRegion,
  awsSecretAccessKey,
  emulatedFormFactor,
  extraHeaders,
  locale,
  overridesJsonFile,
  maxWaitForLoad,
  outputDirectory,
  throttling,
  throttlingMethod,
  urls,
  verbose
}) => {
  // check for overrides config or options
  let overrides;
  if (overridesJsonFile) {
    const overridesJsonString = fs.readFileSync(overridesJsonFile).toString();
    const overridesJson = JSON.parse(overridesJsonString);

    if (overridesJson.config || overridesJson.options) {
      overrides = overridesJson;
    }
  }

  // a list of audit configurations
  const auditConfigs = [];

  // collect all audit configs
  for (const url of urls) {
    const options = {
      awsAccessKeyId,
      awsBucket,
      awsRegion,
      awsSecretAccessKey,
      emulatedFormFactor,
      extraHeaders,
      locale,
      maxWaitForLoad,
      outputDirectory,
      overrides,
      throttling,
      throttlingMethod,
      url,
      verbose
    };

    if (options.emulatedFormFactor !== 'all') {
      auditConfigs.push(options);
    } else {
      // establish two audits for all device types
      auditConfigs.push({
        ...options,
        emulatedFormFactor: 'desktop'
      });
      auditConfigs.push({
        ...options,
        emulatedFormFactor: 'mobile'
      });
    }
  }

  const auditResults = [];
  let index = 1;

  // for each audit config, run the audit
  for (const auditConfig of auditConfigs) {
    if (verbose) {
      console.log(
        `${NAME}: Auditing ${auditConfig.emulatedFormFactor} (${index}/${auditConfigs.length}): ${auditConfig.url}`
      );
    }
    const lighthouseAuditResult = await localLighthouse(auditConfig);
    auditResults.push(lighthouseAuditResult);
    index++;
  }

  // if outputDirectory is specified write the results to disk
  if (outputDirectory) {
    writeResults({
      outputDirectory,
      results: auditResults
    });
  }

  return auditResults;
};
