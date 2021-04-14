import fs from 'fs';
import get from 'lodash.get';
import lighthouse from 'lighthouse';
import ReportGenerator from 'lighthouse/lighthouse-core/report/report-generator';
import * as chromeLauncher from 'chrome-launcher';
import AWS from 'aws-sdk';
import config from './config';
import defaultOptions from './options';
import upload from './helpers/upload';
import getPageSpeedInsightsApiResult from './helpers/getPageSpeedInsightsApiResult';

const PROTOCOL_TIMEOUT = 'PROTOCOL_TIMEOUT';

const createTimeout = time =>
  new Promise(resolve => {
    setTimeout(resolve, time, PROTOCOL_TIMEOUT);
  });

// https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
export default async ({
  awsAccessKeyId: accessKeyId,
  awsBucket: Bucket,
  awsRegion: region,
  awsSecretAccessKey: secretAccessKey,
  config: customConfig,
  finalScreenshotAwsBucket,
  options: customOptions,
  outputDirectory,
  updateReport,
  psiKey,
  timeout,
  url
}) => {
  // will upload to S3?
  const isS3 = !!(accessKeyId && region && secretAccessKey);

  // if a URL, output directory, or S3 creds are missing - we got a problem.
  if (!outputDirectory && !url && !isS3) {
    throw new Error('Missing required params.');
  }

  // the default config combined with overriding query params
  const fullConfig = {
    ...config,
    ...customConfig
  };

  const options = {
    ...defaultOptions,
    ...customOptions
  };

  // we need to kill chrome if something goes wrong, so we pull it up
  // into the function scope to be accessible in the catch block.
  let chrome;

  try {
    let results;
    let loadingExperience;
    let originLoadingExperience;

    // if we're getting results from the PageSpeed Insights API... else
    // run Lighthouse directly
    if (psiKey) {
      const strategy =
        fullConfig.settings.emulatedFormFactor === 'desktop'
          ? 'DESKTOP'
          : 'MOBILE';
      const psiResults = await getPageSpeedInsightsApiResult({
        psiKey,
        strategy,
        url
      });

      if (psiResults.error) {
        throw Error(psiResults.error.message);
      }

      results = {
        lhr: psiResults.lighthouseResult,
        report: ReportGenerator.generateReportHtml(psiResults.lighthouseResult)
      };

      if (psiResults.loadingExperience) {
        loadingExperience = psiResults.loadingExperience;
      }

      if (psiResults.originLoadingExperience) {
        originLoadingExperience = psiResults.originLoadingExperience;
      }
    } else {
      chrome = await chromeLauncher.launch({
        chromeFlags: options.chromeFlags,
        port: options.port
      });

      options.output = 'html';

      results = !timeout
        ? await lighthouse(url, options, fullConfig)
        : await Promise.race([
            createTimeout(timeout),
            lighthouse(url, options, fullConfig)
          ]);

      if (results === PROTOCOL_TIMEOUT) {
        throw Error(PROTOCOL_TIMEOUT);
      }

      await chrome.kill();
    }

    // a remote URL
    let report;

    // a local file path
    let localReport;

    // the final thumbnail image
    let finalScreenshot;

    const reportContent = !updateReport
      ? results.report
      : updateReport(results.report);

    if (isS3) {
      if (Bucket && reportContent) {
        // upload to S3
        const s3Response = await upload({
          s3bucket: new AWS.S3({
            accessKeyId,
            Bucket,
            region,
            secretAccessKey
          }),
          params: {
            ACL: 'public-read',
            Body: reportContent,
            Bucket,
            ContentType: 'text/html',
            Key: `report-${Date.now()}.html`
          }
        });

        report = s3Response.Location;
      }

      if (finalScreenshotAwsBucket) {
        const finalScreenshotData = get(
          results,
          `lhr.audits['final-screenshot'].details.data`
        );

        if (finalScreenshotData) {
          const buffer = Buffer.from(
            finalScreenshotData.replace('data:image/jpeg;base64,', ''),
            'base64'
          );
          const s3Response = await upload({
            s3bucket: new AWS.S3({
              accessKeyId,
              Bucket,
              region,
              secretAccessKey
            }),
            params: {
              ACL: 'public-read',
              Body: buffer,
              Bucket: finalScreenshotAwsBucket,
              ContentEncoding: 'base64',
              ContentType: 'image/jpeg',
              Key: `final-screenshot-${Date.now()}.jpg`
            }
          });
          finalScreenshot = s3Response.Location;
        }
      }
    }

    if (outputDirectory) {
      localReport = `${outputDirectory}/report-${Date.now()}.html`;
      fs.writeFileSync(localReport, reportContent);
    }

    return {
      finalScreenshot,
      loadingExperience,
      localReport,
      originLoadingExperience,
      result: JSON.parse(JSON.stringify(results.lhr)),
      report
    };
  } catch (error) {
    // make sure we kill chrome
    if (chrome) {
      await chrome.kill();
    }

    throw error;
  }
};
