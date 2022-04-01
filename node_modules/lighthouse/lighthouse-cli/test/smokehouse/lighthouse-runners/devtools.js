/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview A runner that launches Chrome and executes Lighthouse via DevTools.
 */

import fs from 'fs';
import os from 'os';
import {spawn} from 'child_process';

import {LH_ROOT} from '../../../../root.js';

const devtoolsDir =
  process.env.DEVTOOLS_PATH || `${LH_ROOT}/.tmp/chromium-web-tests/devtools/devtools-frontend`;

/**
 * @param {string} command
 * @param {string[]} args
 */
async function spawnAndLog(command, args) {
  let log = '';

  /** @type {Promise<void>} */
  const promise = new Promise((resolve, reject) => {
    const spawnHandle = spawn(command, args);
    spawnHandle.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error(`Command exited with code ${code}`));
    });
    spawnHandle.on('error', reject);
    spawnHandle.stdout.on('data', data => {
      console.log(data.toString());
      log += `STDOUT: ${data.toString()}`;
    });
    spawnHandle.stderr.on('data', data => {
      console.log(data.toString());
      log += `STDERR: ${data.toString()}`;
    });
  });
  await promise;

  return log;
}

/** @type {Promise<void>} */
let buildDevtoolsPromise;
/**
 * Download/pull latest DevTools, build Lighthouse for DevTools, roll to DevTools, and build DevTools.
 */
async function buildDevtools() {
  if (process.env.CI) return;

  process.env.DEVTOOLS_PATH = devtoolsDir;
  await spawnAndLog('bash', ['lighthouse-core/test/chromium-web-tests/download-devtools.sh']);
  await spawnAndLog('bash', ['lighthouse-core/test/chromium-web-tests/roll-devtools.sh']);
}

/**
 * Launch Chrome and do a full Lighthouse run via DevTools.
 * By default, the latest DevTools frontend is used (.tmp/chromium-web-tests/devtools/devtools-frontend)
 * unless DEVTOOLS_PATH is set.
 * CHROME_PATH determines which Chrome is used–otherwise the default is puppeteer's chrome binary.
 * @param {string} url
 * @param {LH.Config.Json=} configJson
 * @param {{isDebug?: boolean}=} testRunnerOptions
 * @return {Promise<{lhr: LH.Result, artifacts: LH.Artifacts, log: string}>}
 */
async function runLighthouse(url, configJson, testRunnerOptions = {}) {
  if (!buildDevtoolsPromise) buildDevtoolsPromise = buildDevtools();
  await buildDevtoolsPromise;

  const outputDir = fs.mkdtempSync(os.tmpdir() + '/lh-smoke-cdt-runner-');
  const chromeFlags = [
    `--custom-devtools-frontend=file://${devtoolsDir}/out/Default/gen/front_end`,
  ];
  const args = [
    'run-devtools',
    url,
    `--chrome-flags=${chromeFlags.join(' ')}`,
    '--output-dir', outputDir,
  ];
  if (configJson) {
    args.push('--config', JSON.stringify(configJson));
  }

  const log = await spawnAndLog('yarn', args);
  const lhr = JSON.parse(fs.readFileSync(`${outputDir}/lhr-0.json`, 'utf-8'));
  const artifacts = JSON.parse(fs.readFileSync(`${outputDir}/artifacts-0.json`, 'utf-8'));

  if (testRunnerOptions.isDebug) {
    console.log(`${url} results saved at ${outputDir}`);
  } else {
    fs.rmSync(outputDir, {recursive: true, force: true});
  }

  return {lhr, artifacts, log};
}

export {
  runLighthouse,
};
