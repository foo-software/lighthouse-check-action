/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @type {Array<Smokehouse.TestDfn>} */
const smokeTests = [{
  id: 'a11y',
  expectations: require('./a11y/expectations.js'),
  config: require('./a11y/a11y-config.js'),
  batch: 'parallel-first',
}, {
  id: 'errors',
  expectations: require('./error-expectations.js'),
  config: require('./error-config.js'),
  batch: 'errors',
}, {
  id: 'oopif',
  expectations: require('./oopif-expectations.js'),
  config: require('./oopif-config.js'),
  batch: 'parallel-first',
}, {
  id: 'pwa',
  expectations: require('./pwa-expectations.js'),
  config: require('./pwa-config.js'),
  batch: 'parallel-second',
}, {
  id: 'pwa2',
  expectations: require('./pwa2-expectations.js'),
  config: require('./pwa-config.js'),
  batch: 'parallel-second',
}, {
  id: 'pwa3',
  expectations: require('./pwa3-expectations.js'),
  config: require('./pwa-config.js'),
  batch: 'parallel-first',
}, {
  id: 'dbw',
  expectations: require('./dobetterweb/dbw-expectations.js'),
  config: require('./dbw-config.js'),
  batch: 'parallel-second',
}, {
  id: 'redirects',
  expectations: require('./redirects/expectations.js'),
  config: require('./redirects-config.js'),
  batch: 'parallel-first',
}, {
  id: 'seo',
  expectations: require('./seo/expectations.js'),
  config: require('./seo-config.js'),
  batch: 'parallel-first',
}, {
  id: 'offline',
  expectations: require('./offline-local/offline-expectations.js'),
  config: require('./offline-config.js'),
  batch: 'offline',
}, {
  id: 'byte',
  expectations: require('./byte-efficiency/expectations.js'),
  config: require('./byte-config.js'),
  batch: 'perf-opportunity',
}, {
  id: 'perf',
  expectations: require('./perf/expectations.js'),
  config: require('./perf/perf-config.js'),
  batch: 'perf-metric',
}, {
  id: 'lantern',
  expectations: require('./perf/lantern-expectations.js'),
  config: require('./lantern-config.js'),
  batch: 'parallel-first',
}, {
  id: 'metrics',
  expectations: require('./tricky-metrics/expectations.js'),
  config: require('../../../lighthouse-core/config/perf-config.js'),
  batch: 'parallel-second',
}];

module.exports = smokeTests;
