/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const swapLocale = require('../../localization/swap-locale.js');

const lhr = require('../../../lighthouse-core/test/results/sample_v2.json');

/* eslint-env jest */
describe('swap-locale', () => {
  it('does not mutate the original lhr', () => {
    /** @type {LH.Result} */
    const lhrClone = JSON.parse(JSON.stringify(lhr));

    const lhrPt = swapLocale(lhr, 'pt').lhr;
    expect(lhrPt).not.toStrictEqual(lhr);
    expect(lhr).toStrictEqual(lhrClone);
  });

  it('can change golden LHR english strings into german', () => {
    /** @type {LH.Result} */
    const lhrEn = JSON.parse(JSON.stringify(lhr));
    const lhrDe = swapLocale(lhrEn, 'de').lhr;

    // Basic replacement
    expect(lhrEn.audits.plugins.title).toEqual('Document avoids plugins');
    expect(lhrDe.audits.plugins.title).toEqual('Dokument verwendet keine Plug-ins');

    // With ICU string argument values
    expect(lhrEn.audits['dom-size'].displayValue).toMatchInlineSnapshot(`"153 elements"`);
    /* eslint-disable no-irregular-whitespace */
    expect(lhrDe.audits['dom-size'].displayValue).toMatchInlineSnapshot(`"153 Elemente"`);

    // Renderer formatted strings
    expect(lhrEn.i18n.rendererFormattedStrings.labDataTitle).toEqual('Lab Data');
    expect(lhrDe.i18n.rendererFormattedStrings.labDataTitle).toEqual('Labdaten');

    // Formatted numbers in placeholders.
    expect(lhrEn.audits['mainthread-work-breakdown'].displayValue).
toMatchInlineSnapshot(`"2.2 s"`);
    expect(lhrDe.audits['mainthread-work-breakdown'].displayValue).
toMatchInlineSnapshot(`"2,2 s"`);
    /* eslint-enable no-irregular-whitespace */
  });

  it('can roundtrip back to english correctly', () => {
    /** @type {LH.Result} */
    const lhrEn = JSON.parse(JSON.stringify(lhr));

    // via Spanish
    const lhrEnEsRT = swapLocale(swapLocale(lhrEn, 'es').lhr, 'en-US').lhr;
    expect(lhrEnEsRT).toEqual(lhrEn);

    // via Arabic
    const lhrEnArRT = swapLocale(swapLocale(lhrEn, 'ar').lhr, 'en-US').lhr;
    expect(lhrEnArRT).toEqual(lhrEn);
  });

  it('leaves alone messages where there is no translation available', () => {
    const miniLHR = {
      audits: {
        redirects: {
          id: 'redirects',
          title: 'Avoid multiple page redirects',
          doesntExist: 'A string that does not have localized versions',
        },
        fakeaudit: {
          id: 'fakeaudit',
          title: 'An audit without translations',
        },
      },
      configSettings: {
        locale: 'en-US',
      },
      i18n: {
        icuMessagePaths: {
          'lighthouse-core/audits/redirects.js | title': ['audits.redirects.title'],
          // File that exists, but `doesntExist` message within it does not.
          'lighthouse-core/audits/redirects.js | doesntExist': ['audits.redirects.doesntExist'],
          // File and message which do not exist.
          'lighthouse-core/audits/fakeaudit.js | title': ['audits.fakeaudit.title'],
        },
      },
    };
    const {missingIcuMessageIds} = swapLocale(miniLHR, 'es');

    // Updated strings are not found, so these remain in the original language
    expect(missingIcuMessageIds).toMatchInlineSnapshot(`
Array [
  "lighthouse-core/audits/redirects.js | doesntExist",
  "lighthouse-core/audits/fakeaudit.js | title",
]
`);
  });

  it('does not change properties that are not strings', () => {
    // Unlikely, but possible e.g. if an audit details changed shape over LH versions.
    const miniLhr = {
      audits: {
        redirects: {
          id: 'redirects',
          title: 'Avoid multiple page redirects',
        },
      },
      configSettings: {
        locale: 'en-US',
      },
      i18n: {
        icuMessagePaths: {
          // Points to audit object, not string.
          'lighthouse-core/audits/redirects.js | title': ['audits.redirects'],
          // Path does not point to anything in LHR.
          'lighthouse-core/audits/redirects.js | description': ['gatherers..X'],
        },
      },
    };
    const testLocale = 'ru';
    const {lhr} = swapLocale(miniLhr, testLocale);

    // LHR remains unchanged except for locale and injected `rendererFormattedStrings`.
    miniLhr.configSettings.locale = testLocale;
    miniLhr.i18n.rendererFormattedStrings = expect.any(Object);
    expect(lhr).toEqual(miniLhr);
  });
});
