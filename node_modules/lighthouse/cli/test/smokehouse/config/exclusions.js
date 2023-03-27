/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * List of smoke tests excluded per runner. eg: 'cli': ['a11y', 'dbw']
 * @type {Record<string, Array<string>>}
 */
const exclusions = {
  'bundle': [],
  'cli': [],
  'devtools': [
    // Disabled because normal Chrome usage makes DevTools not function on
    // these poorly constructed pages
    'errors-expired-ssl', 'errors-infinite-loop',
    // Disabled because Chrome will follow the redirect first, and Lighthouse will
    // only ever see/run the final URL.
    'redirects-client-paint-server', 'redirects-multiple-server',
    'redirects-single-server', 'redirects-single-client',
    'redirects-history-push-state', 'redirects-scripts',
    // Disabled because these tests use settings that cannot be fully configured in
    // DevTools (e.g. throttling method "provided").
    'metrics-tricky-tti', 'metrics-tricky-tti-late-fcp', 'screenshot',
    // Disabled because of differences that need further investigation
    'byte-efficiency', 'byte-gzip', 'perf-preload',
  ],
};

// https://github.com/GoogleChrome/lighthouse/issues/14271
for (const array of Object.values(exclusions)) {
  array.push('lantern-idle-callback-short');
}

export default exclusions;
