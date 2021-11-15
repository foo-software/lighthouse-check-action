#!/usr/bin/env node
/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview A smokehouse frontend for running from the command line. Parse
 * flags, start fixture webservers, then run smokehouse.
 */

/* eslint-disable no-console */

import {strict as assert} from 'assert';
import path from 'path';
import fs from 'fs';
import url from 'url';

import cloneDeep from 'lodash.clonedeep';
import yargs from 'yargs';
import * as yargsHelpers from 'yargs/helpers';
import log from 'lighthouse-logger';

import {runSmokehouse} from '../smokehouse.js';
import {updateTestDefnFormat} from './back-compat-util.js';
import {LH_ROOT} from '../../../../root.js';

const coreTestDefnsPath =
  path.join(LH_ROOT, 'lighthouse-cli/test/smokehouse/test-definitions/core-tests.js');

/**
 * Possible Lighthouse runners. Loaded dynamically so e.g. a CLI run isn't
 * contingent on having built all the bundles.
 */
const runnerPaths = {
  cli: '../lighthouse-runners/cli.js',
  bundle: '../lighthouse-runners/bundle.js',
};

/**
 * Determine batches of smoketests to run, based on the `requestedIds`.
 * @param {Array<Smokehouse.TestDfn>} allTestDefns
 * @param {Array<string>} requestedIds
 * @param {{invertMatch: boolean}} options
 * @return {Array<Smokehouse.TestDfn>}
 */
function getDefinitionsToRun(allTestDefns, requestedIds, {invertMatch}) {
  let smokes = [];
  const usage = `    ${log.dim}yarn smoke ${allTestDefns.map(t => t.id).join(' ')}${log.reset}\n`;

  if (requestedIds.length === 0 && !invertMatch) {
    smokes = [...allTestDefns];
    console.log('Running ALL smoketests. Equivalent to:');
    console.log(usage);
  } else {
    smokes = allTestDefns.filter(test => {
      // Include all tests that *include* requested id.
      // e.g. a requested 'pwa' will match 'pwa-airhorner', 'pwa-caltrain', etc
      let isRequested = requestedIds.some(requestedId => test.id.includes(requestedId));
      if (invertMatch) isRequested = !isRequested;
      return isRequested;
    });
    console.log(`Running ONLY smoketests for: ${smokes.map(t => t.id).join(' ')}\n`);
  }

  const unmatchedIds = requestedIds.filter(requestedId => {
    return !allTestDefns.map(t => t.id).some(id => id.includes(requestedId));
  });
  if (unmatchedIds.length) {
    console.log(log.redify(`Smoketests not found for: ${unmatchedIds.join(' ')}`));
    console.log(usage);
  }

  if (!smokes.length) {
    throw new Error('no smoketest found to run');
  }

  return smokes;
}

/**
 * Parses the cli `shardArg` flag into `shardNumber/shardTotal`. Splits
 * `testDefns` into `shardTotal` shards and returns the `shardNumber`th shard.
 * Shards will differ in size by at most 1.
 * Shard params must be 1 ≤ shardNumber ≤ shardTotal.
 * @param {Array<Smokehouse.TestDfn>} testDefns
 * @param {string=} shardArg
 * @return {Array<Smokehouse.TestDfn>}
 */
function getShardedDefinitions(testDefns, shardArg) {
  if (!shardArg) return testDefns;

  // eslint-disable-next-line max-len
  const errorMessage = `'shard' must be of the form 'n/d' and n and d must be positive integers with 1 ≤ n ≤ d. Got '${shardArg}'`;
  const match = /^(?<shardNumber>\d+)\/(?<shardTotal>\d+)$/.exec(shardArg);
  assert(match && match.groups, errorMessage);
  const shardNumber = Number(match.groups.shardNumber);
  const shardTotal = Number(match.groups.shardTotal);
  assert(shardNumber > 0 && Number.isInteger(shardNumber), errorMessage);
  assert(shardTotal > 0 && Number.isInteger(shardTotal));
  assert(shardNumber <= shardTotal, errorMessage);

  // Array is sharded with `Math.ceil(length / shardTotal)` shards first
  // and then the remaining `Math.floor(length / shardTotal) shards.
  // e.g. `[0, 1, 2, 3]` split into 3 shards is `[[0, 1], [2], [3]]`.
  const baseSize = Math.floor(testDefns.length / shardTotal);
  const biggerSize = baseSize + 1;
  const biggerShardCount = testDefns.length % shardTotal;

  // Since we don't have tests for this file, construct all shards so correct
  // structure can be asserted.
  const shards = [];
  let index = 0;
  for (let i = 0; i < shardTotal; i++) {
    const shardSize = i < biggerShardCount ? biggerSize : baseSize;
    shards.push(testDefns.slice(index, index + shardSize));
    index += shardSize;
  }
  assert.equal(shards.length, shardTotal);
  assert.deepEqual(shards.flat(), testDefns);

  const shardDefns = shards[shardNumber - 1];
  console.log(`In this shard (${shardArg}), running: ${shardDefns.map(d => d.id).join(' ')}\n`);
  return shardDefns;
}

/**
 * Prune the `networkRequests` from the test expectations when `takeNetworkRequestUrls`
 * is not defined. Custom servers may not have this method available in-process.
 * Also asserts that any expectation with `networkRequests` is run serially. For core
 * tests, we don't currently have a good way to map requests to test definitions if
 * the tests are run in parallel.
 * @param {Array<Smokehouse.TestDfn>} testDefns
 * @param {Function|undefined} takeNetworkRequestUrls
 * @return {Array<Smokehouse.TestDfn>}
 */
function pruneExpectedNetworkRequests(testDefns, takeNetworkRequestUrls) {
  const pruneNetworkRequests = !takeNetworkRequestUrls;

  const clonedDefns = cloneDeep(testDefns);
  for (const {id, expectations, runSerially} of clonedDefns) {
    if (!runSerially && expectations.networkRequests) {
      throw new Error(`'${id}' must be set to 'runSerially: true' to assert 'networkRequests'`);
    }

    if (pruneNetworkRequests && expectations.networkRequests) {
      // eslint-disable-next-line max-len
      const msg = `'networkRequests' cannot be asserted in test '${id}'. They should only be asserted on tests from an in-process server`;
      if (process.env.CI) {
        // If we're in CI, we require any networkRequests expectations to be asserted.
        throw new Error(msg);
      }

      console.warn(log.redify('Warning:'),
          `${msg}. Pruning expectation: ${JSON.stringify(expectations.networkRequests)}`);
      expectations.networkRequests = undefined;
    }
  }

  return clonedDefns;
}

/**
 * CLI entry point.
 */
async function begin() {
  const y = yargs(yargsHelpers.hideBin(process.argv));
  const rawArgv = y
    .help('help')
    .usage('node $0 [<options>] <test-ids>')
    .example('node $0 -j=1 pwa seo', 'run pwa and seo tests serially')
    .example('node $0 --invert-match byte', 'run all smoke tests but `byte`')
    .option('_', {
      array: true,
      type: 'string',
    })
    .options({
      'debug': {
        type: 'boolean',
        default: false,
        describe: 'Save test artifacts and output verbose logs',
      },
      'fraggle-rock': {
        type: 'boolean',
        default: false,
        describe: 'Use the new Fraggle Rock runner',
      },
      'jobs': {
        type: 'number',
        alias: 'j',
        describe: 'Manually set the number of jobs to run at once. `1` runs all tests serially',
      },
      'retries': {
        type: 'number',
        describe: 'The number of times to retry failing tests before accepting. Defaults to 0',
      },
      'runner': {
        default: 'cli',
        choices: ['cli', 'bundle'],
        describe: 'The method of running Lighthouse',
      },
      'tests-path': {
        type: 'string',
        describe: 'The path to a set of test definitions to run. Defaults to core smoke tests.',
      },
      'invert-match': {
        type: 'boolean',
        default: false,
        describe: 'Run all available tests except the ones provided',
      },
      'shard': {
        type: 'string',
        // eslint-disable-next-line max-len
        describe: 'A argument of the form "n/d", which divides the selected tests into d groups and runs the nth group. n and d must be positive integers with 1 ≤ n ≤ d.',
      },
    })
    .wrap(y.terminalWidth())
    .argv;

  // Augmenting yargs type with auto-camelCasing breaks in tsc@4.1.2 and @types/yargs@15.0.11,
  // so for now cast to add yarg's camelCase properties to type.
  const argv = /** @type {typeof rawArgv & CamelCasify<typeof rawArgv>} */ (rawArgv);

  const jobs = Number.isFinite(argv.jobs) ? argv.jobs : undefined;
  const retries = Number.isFinite(argv.retries) ? argv.retries : undefined;

  const runnerPath = runnerPaths[/** @type {keyof typeof runnerPaths} */ (argv.runner)];
  if (argv.runner === 'bundle') {
    console.log('\n✨ Be sure to have recently run this: yarn build-all');
  }
  const {runLighthouse} = await import(runnerPath);

  // Find test definition file and filter by requestedTestIds.
  let testDefnPath = argv.testsPath || coreTestDefnsPath;
  testDefnPath = path.resolve(process.cwd(), testDefnPath);
  const requestedTestIds = argv._;
  const {default: rawTestDefns} = await import(url.pathToFileURL(testDefnPath).href);
  const allTestDefns = updateTestDefnFormat(rawTestDefns);
  const invertMatch = argv.invertMatch;
  const requestedTestDefns = getDefinitionsToRun(allTestDefns, requestedTestIds, {invertMatch});
  const testDefns = getShardedDefinitions(requestedTestDefns, argv.shard);

  let smokehouseResult;
  let server;
  let serverForOffline;
  let takeNetworkRequestUrls = undefined;

  try {
    // If running the core tests, spin up the test server.
    if (testDefnPath === coreTestDefnsPath) {
      ({server, serverForOffline} = await import('../../fixtures/static-server.js'));
      server.listen(10200, 'localhost');
      serverForOffline.listen(10503, 'localhost');
      takeNetworkRequestUrls = server.takeRequestUrls.bind(server);
    }

    const prunedTestDefns = pruneExpectedNetworkRequests(testDefns, takeNetworkRequestUrls);
    const options = {
      jobs,
      retries,
      isDebug: argv.debug,
      useFraggleRock: argv.fraggleRock,
      lighthouseRunner: runLighthouse,
      takeNetworkRequestUrls,
    };

    smokehouseResult = (await runSmokehouse(prunedTestDefns, options));
  } finally {
    if (server) await server.close();
    if (serverForOffline) await serverForOffline.close();
  }

  if (!smokehouseResult.success) {
    const failedTestResults = smokehouseResult.testResults.filter(r => r.failed);

    // For CI, save failed runs to directory to be uploaded.
    if (process.env.CI) {
      const failuresDir = `${LH_ROOT}/.tmp/smokehouse-ci-failures`;
      fs.mkdirSync(failuresDir, {recursive: true});

      for (const testResult of failedTestResults) {
        for (let i = 0; i < testResult.runs.length; i++) {
          const run = testResult.runs[i];
          fs.writeFileSync(`${failuresDir}/${testResult.id}-${i}.json`, JSON.stringify({
            ...run,
            lighthouseLog: run.lighthouseLog.split('\n'),
            assertionLog: run.assertionLog.split('\n'),
          }, null, 2));
        }
      }
    }

    const cmd = `yarn smoke ${failedTestResults.map(r => r.id).join(' ')}`;
    console.log(`rerun failures: ${cmd}`);
  }

  const exitCode = smokehouseResult.success ? 0 : 1;
  process.exit(exitCode);
}

begin().catch(e => {
  console.error(e);
  process.exit(1);
});
