/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Smoke test runner.
 * Used to test channels other than npm (`run-smoke.js` handles that).
 * Supports skipping and modifiying expectations to match the environment.
 */

/* eslint-disable no-console */

const log = require('lighthouse-logger');
const smokeTests = require('./smoke-test-dfns.js');
const {collateResults, report} = require('./smokehouse-report.js');

/**
 * @param {Smokehouse.FirehouseOptions} options
 */
async function runSmokes(options) {
  const {runLighthouse, urlFilterRegex, skip, modify} = options;

  let passingCount = 0;
  let failingCount = 0;

  for (const test of smokeTests) {
    for (const expected of test.expectations) {
      if (urlFilterRegex && !expected.lhr.requestedUrl.match(urlFilterRegex)) {
        continue;
      }

      console.log(`====== ${expected.lhr.requestedUrl} ======`);
      const reasonToSkip = skip && skip(test, expected);
      if (reasonToSkip) {
        console.log(`skipping: ${reasonToSkip}`);
        continue;
      }

      modify && modify(test, expected);
      const results = await runLighthouse(expected.lhr.requestedUrl, test.config);
      console.log(`Asserting expected results match those found. (${expected.lhr.requestedUrl})`);
      const collated = collateResults(results, expected);
      const counts = report(collated);
      passingCount += counts.passed;
      failingCount += counts.failed;
    }
  }

  if (passingCount) {
    console.log(log.greenify(`${passingCount} passing`));
  }
  if (failingCount) {
    console.log(log.redify(`${failingCount} failing`));
  }

  return {
    success: passingCount > 0 && failingCount === 0,
    passingCount,
    failingCount,
  };
}

module.exports = {
  runSmokes,
};
