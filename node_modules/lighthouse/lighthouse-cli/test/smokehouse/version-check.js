/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Compares chromium version strings: 103.0.5017.0
 */

/**
 * @param {string} versionString
 * @return {number[]}
 */
function parseVersion(versionString) {
  const versionParts = versionString.split('.');
  return versionParts.map(Number);
}

/**
 * @param {number[]} versionA
 * @param {number[]} versionB
 */
function compareVersions(versionA, versionB) {
  for (let i = 0; i < versionA.length; i++) {
    if ((versionA[i] ?? 0) > (versionB[i] ?? 0)) return 1;
    if ((versionA[i] ?? 0) < (versionB[i] ?? 0)) return -1;
  }
  return 0;
}

/**
 * Returns false if fails check.
 * @param {{version: string, min?: string, max?: string}} opts
 */
function chromiumVersionCheck(opts) {
  const version = parseVersion(opts.version);
  const min = opts.min && parseVersion(opts.min);
  const max = opts.max && parseVersion(opts.max);
  if (min && compareVersions(version, min) === -1) return false;
  if (max && compareVersions(version, max) === 1) return false;
  return true;
}

export {
  chromiumVersionCheck,
  compareVersions,
};
