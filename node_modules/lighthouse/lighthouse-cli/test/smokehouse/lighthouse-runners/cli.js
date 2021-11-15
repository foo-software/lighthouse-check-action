/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview  A runner that executes Lighthouse via the Lighthouse CLI to
 * test the full pipeline, from parsing arguments on the command line to writing
 * results to disk. When complete, reads back the artifacts and LHR and returns
 * them.
 */

import {promises as fs} from 'fs';
import {promisify} from 'util';
import {execFile} from 'child_process';

import log from 'lighthouse-logger';

import assetSaver from '../../../../lighthouse-core/lib/asset-saver.js';
import {LocalConsole} from '../lib/local-console.js';
import {ChildProcessError} from '../lib/child-process-error.js';
import {LH_ROOT} from '../../../../root.js';

const execFileAsync = promisify(execFile);

/**
 * Launch Chrome and do a full Lighthouse run via the Lighthouse CLI.
 * @param {string} url
 * @param {LH.Config.Json=} configJson
 * @param {{isDebug?: boolean, useFraggleRock?: boolean}=} testRunnerOptions
 * @return {Promise<{lhr: LH.Result, artifacts: LH.Artifacts, log: string}>}
 */
async function runLighthouse(url, configJson, testRunnerOptions = {}) {
  const {isDebug} = testRunnerOptions;
  const tmpDir = `${LH_ROOT}/.tmp/smokehouse`;
  await fs.mkdir(tmpDir, {recursive: true});
  const tmpPath = await fs.mkdtemp(`${tmpDir}/smokehouse-`);
  return internalRun(url, tmpPath, configJson, testRunnerOptions)
    // Wait for internalRun() before removing scratch directory.
    .finally(() => !isDebug && fs.rmdir(tmpPath, {recursive: true}));
}

/**
 * @param {LH.Config.Json=} configJson
 * @return {LH.Config.Json|undefined}
 */
function convertToFraggleRockConfig(configJson) {
  if (!configJson) return configJson;
  if (!configJson.passes) return configJson;

  return {
    ...configJson,
    navigations: configJson.passes.map(pass => ({...pass, id: pass.passName})),
  };
}

/**
 * Internal runner.
 * @param {string} url
 * @param {string} tmpPath
 * @param {LH.Config.Json=} configJson
 * @param {{isDebug?: boolean, useFraggleRock?: boolean}=} options
 * @return {Promise<{lhr: LH.Result, artifacts: LH.Artifacts, log: string}>}
 */
async function internalRun(url, tmpPath, configJson, options) {
  const {isDebug = false, useFraggleRock = false} = options || {};
  const localConsole = new LocalConsole();

  const outputPath = `${tmpPath}/smokehouse.report.json`;
  const artifactsDirectory = `${tmpPath}/artifacts/`;

  const args = [
    `${LH_ROOT}/lighthouse-cli/index.js`,
    `${url}`,
    `--output-path=${outputPath}`,
    '--output=json',
    `-G=${artifactsDirectory}`,
    `-A=${artifactsDirectory}`,
    '--quiet',
    '--port=0',
  ];

  if (useFraggleRock) {
    args.push('--fraggle-rock');
    configJson = convertToFraggleRockConfig(configJson);
  }

  // Config can be optionally provided.
  if (configJson) {
    const configPath = `${tmpPath}/config.json`;
    await fs.writeFile(configPath, JSON.stringify(configJson));
    args.push(`--config-path=${configPath}`);
  }

  const command = 'node';
  const env = {...process.env, NODE_ENV: 'test'};
  localConsole.log(`${log.dim}$ ${command} ${args.join(' ')} ${log.reset}`);

  /** @type {{stdout: string, stderr: string, code?: number}} */
  let execResult;
  try {
    execResult = await execFileAsync(command, args, {env});
  } catch (e) {
    // exec-thrown errors have stdout, stderr, and exit code from child process.
    execResult = e;
  }

  const exitCode = execResult.code || 0;
  if (isDebug) {
    localConsole.log(`exit code ${exitCode}`);
    localConsole.log(`STDOUT: ${execResult.stdout}`);
    localConsole.log(`STDERR: ${execResult.stderr}`);
  }

  try {
    await fs.access(outputPath);
  } catch (e) {
    throw new ChildProcessError(`Lighthouse run failed to produce a report and exited with ${exitCode}.`, // eslint-disable-line max-len
        localConsole.getLog());
  }

  /** @type {LH.Result} */
  const lhr = JSON.parse(await fs.readFile(outputPath, 'utf8'));
  const artifacts = assetSaver.loadArtifacts(artifactsDirectory);

  // Output has been established as existing, so can log for debug.
  if (isDebug) {
    localConsole.log(`LHR output available at: ${outputPath}`);
    localConsole.log(`Artifacts avaiable in: ${artifactsDirectory}`);
  }

  // There should either be both an error exitCode and a lhr.runtimeError or neither.
  if (Boolean(exitCode) !== Boolean(lhr.runtimeError)) {
    const runtimeErrorCode = lhr.runtimeError && lhr.runtimeError.code;
    throw new ChildProcessError(`Lighthouse did not exit with an error correctly, exiting with ${exitCode} but with runtimeError '${runtimeErrorCode}'`, // eslint-disable-line max-len
        localConsole.getLog());
  }

  return {
    lhr,
    artifacts,
    log: localConsole.getLog(),
  };
}

export {
  runLighthouse,
};
