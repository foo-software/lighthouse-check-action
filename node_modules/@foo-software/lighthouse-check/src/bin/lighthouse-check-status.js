#! /usr/bin/env node
import ora from 'ora';
import getHelpText from '../helpers/getHelpText';
import validateStatus from '../validateStatus';
import { NAME, NAME_STATUS } from '../constants';
import { convertOptionsFromArguments } from '../helpers/arguments';
import { ERROR_INVALID } from '../errorCodes';

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
  },
  verbose: {
    type: 'boolean',
    value: false
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

    if (error && error.code && error.code === ERROR_INVALID) {
      console.log('❌  ', `${error}`);
    } else {
      console.log(
        '❌  Something went wrong while attempting to enqueue URLs for Lighthouse. See the error below.\n\n',
        error
      );
    }

    console.log('\n');
    process.exit(1);
  }
};

if (params.help) {
  console.log(getHelpText(NAME_STATUS));
} else {
  init();
}
