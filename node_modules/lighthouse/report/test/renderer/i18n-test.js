/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

import {strict as assert} from 'assert';

import {Util} from '../../renderer/util.js';
import {I18n} from '../../renderer/i18n.js';
import {isNode12SmallIcu} from '../../../lighthouse-core/test/test-utils.js';

// Require i18n to make sure Intl is polyfilled in Node without full-icu for testing.
// When Util is run in a browser, Intl will be supplied natively (IE11+).
// eslint-disable-next-line no-unused-vars
import '../../../lighthouse-core/lib/i18n/i18n.js';

const NBSP = '\xa0';

/* eslint-env jest */

describe('util helpers', () => {
  it('formats a number', () => {
    const i18n = new I18n('en', {...Util.UIStrings});
    assert.strictEqual(i18n.formatNumber(10), '10');
    assert.strictEqual(i18n.formatNumber(100.01), '100');
    assert.strictEqual(i18n.formatNumber(13000.456), '13,000.5');
  });

  it('formats a date', () => {
    const i18n = new I18n('en', {...Util.UIStrings});
    const timestamp = i18n.formatDateTime('2017-04-28T23:07:51.189Z');
    assert.ok(
      timestamp.includes('Apr 27, 2017') ||
      timestamp.includes('Apr 28, 2017') ||
      timestamp.includes('Apr 29, 2017')
    );
  });

  it('formats bytes', () => {
    const i18n = new I18n('en', {...Util.UIStrings});
    assert.equal(i18n.formatBytesToKiB(100), `0.1${NBSP}KiB`);
    assert.equal(i18n.formatBytesToKiB(2000), `2.0${NBSP}KiB`);
    assert.equal(i18n.formatBytesToKiB(1014 * 1024), `1,014.0${NBSP}KiB`);
  });

  it('formats bytes with different granularities', () => {
    const i18n = new I18n('en', {...Util.UIStrings});

    let granularity = 10;
    assert.strictEqual(i18n.formatBytes(15.0, granularity), `20${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.12345, granularity), `20${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(14.99999, granularity), `10${NBSP}bytes`);

    granularity = 1;
    assert.strictEqual(i18n.formatBytes(15.0, granularity), `15${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.12345, granularity), `15${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.54321, granularity), `16${NBSP}bytes`);

    granularity = 0.5;
    assert.strictEqual(i18n.formatBytes(15.0, granularity), `15.0${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.12345, granularity), `15.0${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.54321, granularity), `15.5${NBSP}bytes`);

    granularity = 0.1;
    assert.strictEqual(i18n.formatBytes(15.0, granularity), `15.0${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.12345, granularity), `15.1${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.19999, granularity), `15.2${NBSP}bytes`);

    granularity = 0.01;
    assert.strictEqual(i18n.formatBytes(15.0, granularity), `15.00${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.12345, granularity), `15.12${NBSP}bytes`);
    assert.strictEqual(i18n.formatBytes(15.19999, granularity), `15.20${NBSP}bytes`);
  });

  it('formats kibibytes with different granularities', () => {
    const i18n = new I18n('en', {...Util.UIStrings});

    let granularity = 10;
    assert.strictEqual(i18n.formatBytesToKiB(5 * 1024, granularity), `10${NBSP}KiB`);
    assert.strictEqual(i18n.formatBytesToKiB(4 * 1024, granularity), `0${NBSP}KiB`);

    granularity = 1;
    assert.strictEqual(i18n.formatBytesToKiB(5 * 1024, granularity), `5${NBSP}KiB`);
    assert.strictEqual(i18n.formatBytesToKiB(4 * 1024 + 512, granularity), `5${NBSP}KiB`);
    assert.strictEqual(i18n.formatBytesToKiB(4 * 1024 + 511, granularity), `4${NBSP}KiB`);

    granularity = 0.01;
    assert.strictEqual(i18n.formatBytesToKiB(5 * 1024, granularity), `5.00${NBSP}KiB`);
    assert.strictEqual(i18n.formatBytesToKiB(5 * 1024 - 5, granularity), `5.00${NBSP}KiB`);
    assert.strictEqual(i18n.formatBytesToKiB(5 * 1024 - 6, granularity), `4.99${NBSP}KiB`);
  });

  it('formats ms', () => {
    const i18n = new I18n('en', {...Util.UIStrings});
    assert.equal(i18n.formatMilliseconds(123), `120${NBSP}ms`);
    assert.equal(i18n.formatMilliseconds(2456.5, 0.1), `2,456.5${NBSP}ms`);
    assert.equal(i18n.formatMilliseconds(0.000001), `0${NBSP}ms`);
    assert.equal(i18n.formatMilliseconds(-0.000001), `0${NBSP}ms`);
  });

  it('formats a duration', () => {
    const i18n = new I18n('en', {...Util.UIStrings});
    assert.equal(i18n.formatDuration(60 * 1000), `1${NBSP}m`);
    assert.equal(i18n.formatDuration(60 * 60 * 1000 + 5000), `1${NBSP}h 5${NBSP}s`);
    assert.equal(i18n.formatDuration(28 * 60 * 60 * 1000 + 5000), `1${NBSP}d 4${NBSP}h 5${NBSP}s`);
  });

  it('formats numbers based on locale', () => {
    // COMPAT: Node 12 only has 'en' by default.
    if (isNode12SmallIcu()) return;

    // Requires full-icu or Intl polyfill.
    const number = 12346.858558;

    const i18n = new I18n('de', {...Util.UIStrings});
    assert.strictEqual(i18n.formatNumber(number), '12.346,9');
    assert.strictEqual(i18n.formatBytesToKiB(number), `12,1${NBSP}KiB`);
    assert.strictEqual(i18n.formatMilliseconds(number), `12.350${NBSP}ms`);
    assert.strictEqual(i18n.formatSeconds(number), `12,3${NBSP}s`);
  });

  it('uses decimal comma with en-XA test locale', () => {
    // COMPAT: Node 12 only has 'en' by default.
    if (isNode12SmallIcu()) return;

    // Requires full-icu or Intl polyfill.
    const number = 12346.858558;

    const i18n = new I18n('en-XA', {...Util.UIStrings});
    assert.strictEqual(i18n.formatNumber(number), '12.346,9');
    assert.strictEqual(i18n.formatBytesToKiB(number), `12,1${NBSP}KiB`);
    assert.strictEqual(i18n.formatMilliseconds(number), `12.350${NBSP}ms`);
    assert.strictEqual(i18n.formatSeconds(number), `12,3${NBSP}s`);
  });

  it('should not crash on unknown locales', () => {
    const i18n = new I18n('unknown-mystery-locale', {...Util.UIStrings});
    const timestamp = i18n.formatDateTime('2017-04-28T23:07:51.189Z');
    assert.ok(
      timestamp.includes('Apr 27, 2017') ||
      timestamp.includes('Apr 28, 2017') ||
      timestamp.includes('Apr 29, 2017')
    );
  });
});
