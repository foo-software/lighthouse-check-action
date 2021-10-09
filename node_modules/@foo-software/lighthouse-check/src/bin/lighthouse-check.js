#! /usr/bin/env node
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import getHelpText from '../helpers/getHelpText';
import lighthouseCheck from '../lighthouseCheck';
import { NAME } from '../constants';
import { convertOptionsFromArguments } from '../helpers/arguments';

const defaultOptions = {
  author: {
    type: 'string',
    value: undefined
  },
  apiToken: {
    type: 'string',
    value: undefined
  },
  awsAccessKeyId: {
    type: 'string',
    value: undefined
  },
  awsBucket: {
    type: 'string',
    value: undefined
  },
  awsRegion: {
    type: 'string',
    value: undefined
  },
  awsSecretAccessKey: {
    type: 'string',
    value: undefined
  },
  branch: {
    type: 'string',
    value: undefined
  },
  configFile: {
    type: 'string',
    value: undefined
  },
  emulatedFormFactor: {
    type: 'string',
    value: undefined
  },
  extraHeaders: {
    type: 'object',
    value: undefined
  },
  locale: {
    type: 'string',
    value: undefined
  },
  help: {
    type: 'boolean',
    value: undefined
  },
  isGitHubAction: {
    type: 'boolean',
    value: undefined
  },
  isOrb: {
    type: 'boolean',
    value: undefined
  },
  maxWaitForLoad: {
    type: 'number',
    value: undefined
  },
  outputDirectory: {
    type: 'string',
    value: undefined
  },
  overridesJsonFile: {
    type: 'string',
    value: undefined
  },
  pr: {
    type: 'string',
    value: undefined
  },
  prCommentAccessToken: {
    type: 'string',
    value: undefined
  },
  prCommentEnabled: {
    type: 'boolean',
    value: true
  },
  prCommentSaveOld: {
    type: 'boolean',
    value: false
  },
  prCommentUrl: {
    type: 'string',
    value: undefined
  },
  sha: {
    type: 'string',
    value: undefined
  },
  slackWebhookUrl: {
    type: 'string',
    value: undefined
  },
  tag: {
    type: 'string',
    value: undefined
  },
  timeout: {
    type: 'number',
    value: undefined
  },
  throttling: {
    type: 'string',
    value: undefined
  },
  throttlingMethod: {
    type: 'string',
    value: undefined
  },
  urls: {
    type: 'array',
    value: undefined
  },
  verbose: {
    type: 'boolean',
    value: false
  },
  wait: {
    type: 'boolean',
    value: undefined
  }
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

    await lighthouseCheck(params);

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
