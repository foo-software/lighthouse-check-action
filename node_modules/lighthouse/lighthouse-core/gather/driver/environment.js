/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const log = require('lighthouse-logger');
const pageFunctions = require('../../lib/page-functions.js');

/**
 * @param {LH.Gatherer.FRProtocolSession} session
 * @return {Promise<LH.Crdp.Browser.GetVersionResponse & {milestone: number}>}
 */
async function getBrowserVersion(session) {
  const status = {msg: 'Getting browser version', id: 'lh:gather:getVersion'};
  log.time(status, 'verbose');
  const version = await session.sendCommand('Browser.getVersion');
  const match = version.product.match(/\/(\d+)/); // eg 'Chrome/71.0.3577.0'
  const milestone = match ? parseInt(match[1]) : 0;
  log.timeEnd(status);
  return Object.assign(version, {milestone});
}

/**
 * Computes the benchmark index to get a rough estimate of device class.
 * @param {LH.Gatherer.FRTransitionalDriver['executionContext']} executionContext
 * @return {Promise<number>}
 */
async function getBenchmarkIndex(executionContext) {
  const status = {msg: 'Benchmarking machine', id: 'lh:gather:getBenchmarkIndex'};
  log.time(status);
  const indexVal = await executionContext.evaluate(pageFunctions.computeBenchmarkIndex, {
    args: [],
  });
  log.timeEnd(status);
  return indexVal;
}

module.exports = {
  getBrowserVersion,
  getBenchmarkIndex,
};
