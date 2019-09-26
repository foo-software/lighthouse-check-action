#! /usr/bin/env node
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import getHelpText from '../helpers/getHelpText';
import lighthouseCheck from '../lighthouseCheck';
import { NAME } from '../constants';
import { convertOptionsFromArguments } from '../helpers/arguments';

const defaultOptions = {
  author: undefined,
  apiToken: undefined,
  awsAccessKeyId: undefined,
  awsBucket: undefined,
  awsRegion: undefined,
  awsSecretAccessKey: undefined,
  branch: undefined,
  configFile: undefined,
  emulatedFormFactor: undefined,
  locale: undefined,
  help: undefined,
  outputDirectory: undefined,
  pr: undefined,
  sha: undefined,
  slackWebhookUrl: undefined,
  tag: undefined,
  timeout: undefined,
  throttling: undefined,
  throttlingMethod: undefined,
  urls: undefined,
  verbose: false,
  wait: undefined
};

// override options with any that are passed in as arguments
let params = convertOptionsFromArguments(defaultOptions);

const init = async () => {
  const spinner = ora(`${NAME}: Running...\n`);

  try {
    if (params.configFile) {
      const configFile = path.resolve(params.configFile);
      const configJsonString = fs.readFileSync(configFile).toString();
      const configJson = JSON.parse(configJsonString);

      // extend params with config json file contents
      params = {
        ...params,
        ...configJson
      };
    }

    if (!params.verbose) {
      console.log('\n');
      spinner.start();
    }

    // if urls are in string format, we need to split them int an array,
    // otherwise they may already be an array from a config json file.
    const urls =
      typeof params.urls !== 'string' ? params.urls : params.urls.split(',');

    await lighthouseCheck({
      ...params,
      urls
    });

    process.exit();
  } catch (error) {
    if (!params.verbose) {
      spinner.stop();
    } else {
      console.log('\n');
    }

    console.log(
      '❌  Something went wrong while attempting to enqueue URLs for Lighthouse. See the error below.\n\n',
      error
    );
    console.log('\n');
    process.exit(1);
  }
};

if (params.help) {
  console.log(getHelpText(NAME));
} else {
  init();
}
