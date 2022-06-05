/**
 * @license Copyright 2022 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

import {chromiumVersionCheck, compareVersions} from './version-check.js';

/* eslint-env jest */

describe('version check', () => {
  it('compareVersions', async () => {
    expect(compareVersions([100, 0, 0, 0], [100, 0, 0, 0])).toBe(0);
    expect(compareVersions([101, 0, 0, 0], [100, 0, 0, 0])).toBe(1);
    expect(compareVersions([99, 0, 0, 0], [100, 0, 0, 0])).toBe(-1);

    expect(compareVersions([100, 0, 10, 0], [100, 0, 10, 0])).toBe(0);
    expect(compareVersions([100, 0, 11, 0], [100, 0, 10, 0])).toBe(1);
    expect(compareVersions([100, 0, 9, 0], [100, 0, 10, 0])).toBe(-1);

    expect(compareVersions([100, 0, 0, 0], [100])).toBe(0);
    expect(compareVersions([100, 0, 0, 1], [100])).toBe(1);
    expect(compareVersions([99, 0, 0, 0], [100])).toBe(-1);
  });

  it('chromiumVersionCheck', async () => {
    expect(chromiumVersionCheck({version: '100'})).toBe(true);
    expect(chromiumVersionCheck({version: '100', min: '100'})).toBe(true);
    expect(chromiumVersionCheck({version: '100', max: '100'})).toBe(true);
    expect(chromiumVersionCheck({version: '100', min: '101'})).toBe(false);
    expect(chromiumVersionCheck({version: '100', max: '99'})).toBe(false);

    expect(chromiumVersionCheck({version: '100.0.2331.3'})).toBe(true);
    expect(chromiumVersionCheck({version: '100.0.2331.3', min: '100.0.2331.3'})).toBe(true);
    expect(chromiumVersionCheck({version: '100.0.2331.3', min: '100.0.0.0'})).toBe(true);
    expect(chromiumVersionCheck({version: '100.0.2331.3', max: '100.0.3333.3'})).toBe(true);
    expect(chromiumVersionCheck({version: '100.0.2331.3', min: '100.0.2331.2'})).toBe(true);
    expect(chromiumVersionCheck({version: '100.0.2331.3', max: '99'})).toBe(false);

    expect(chromiumVersionCheck({
      version: '100.0.2331.3', min: '100.0.2331.0', max: '100.0.2331.10'})).toBe(true);
    expect(chromiumVersionCheck({
      version: '100.3.2331.3', min: '100.0.2331.0', max: '100.0.2331.10'})).toBe(false);
  });
});
