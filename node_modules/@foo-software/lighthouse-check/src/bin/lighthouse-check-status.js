#! /usr/bin/env node
import ora from 'ora';
import getHelpText from '../helpers/getHelpText';
import validateStatus from '../validateStatus';
import { NAME, NAME_STATUS } from '../constants';
import { convertOptionsFromArguments } from '../helpers/arguments';

const defaultOptions = {
  minAccessibilityScore: {
    type: 'number',
    value: undefined
  },
  minBestPracticesScore: {
    type: 'number',
    value: undefined
  },
  minPerformanceScore: {
    type: 'number',
    value: undefined
  },
  minProgressiveWebAppScore: {
    type: 'number',
    value: undefined
  },
  minSeoScore: {
    type: 'number',
    value: undefined
  },
  help: {
    type: 'boolean',
    value: undefined
  },
  outputDirectory: {
    type: 'string',
    value: undefined
  }
};

// override options with any that are passed in as arguments
let params = convertOptionsFromArguments(defaultOptions);

const init = async () => {
  const spinner = ora(`${NAME}: Running...\n`);

  try {
    if (!params.verbose) {
      console.log('\n');
      spinner.start();
    }

    await validateStatus(params);

    process.exit();
  } catch (error) {
    if (!params.verbose) {
      spinner.stop();
    } else {
      console.log('\n');
    }

    console.log(
      '❌  Scores did not meet requirement or something else went wrong. See below.\n\n',
      error
    );
    console.log('\n');
    process.exit(1);
  }
};

if (params.help) {
  console.log(getHelpText(NAME_STATUS));
} else {
  init();
}
