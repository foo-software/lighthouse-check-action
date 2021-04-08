import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import AWS from 'aws-sdk';
import config from './config';
import defaultOptions from './options';
import upload from './helpers/upload';

// https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically
export default async ({
  awsAccessKeyId: accessKeyId,
  awsBucket: Bucket,
  awsRegion: region,
  awsSecretAccessKey: secretAccessKey,
  config: customConfig,
  options: customOptions,
  outputDirectory,
  updateReport,
  url
}) => {
  // will upload to S3?
  const isS3 = !!(accessKeyId && Bucket && region && secretAccessKey);

  // if a URL, output directory, or S3 creds are missing - we got a problem.
  if (!outputDirectory && !url && !isS3) {
    throw new Error('Missing required params.');
  }

  const options = {
    ...defaultOptions,
    ...customOptions
  };

  // we need to kill chrome if something goes wrong, so we pull it up
  // into the function scope to be accessible in the catch block.
  let chrome;

  try {
    chrome = await chromeLauncher.launch({
      chromeFlags: options.chromeFlags,
      port: options.port
    });

    options.output = 'html';

    // the default config combined with overriding query params
    const fullConfig = {
      ...config,
      ...customConfig
    };

    const results = await lighthouse(url, options, fullConfig);

    // a remote URL
    let report;

    // a local file path
    let localReport;

    const reportContent = !updateReport
      ? results.report
      : updateReport(results.report);

    if (isS3) {
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

    if (outputDirectory) {
      localReport = `${outputDirectory}/report-${Date.now()}.html`;
      fs.writeFileSync(localReport, reportContent);
    }

    await chrome.kill();

    return {
      localReport,
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
