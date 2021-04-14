/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 * Expected Lighthouse audit values for byte efficiency tests
 */
const expectations = [
  {
    artifacts: {
      ScriptElements: [
        {
          type: null,
          src: null,
          async: false,
          defer: false,
          source: 'head',
          // Only do a single assertion for `devtoolsNodePath`: this can be flaky for elements
          // deep in the DOM, and the sample LHR test has plenty of places that would catch
          // a regression in `devtoolsNodePath` calculation. Keep just one for the benefit
          // of other smoke test runners.
          node: {
            devtoolsNodePath: '2,HTML,0,HEAD,3,SCRIPT',
          },
        },
        {
          type: 'application/javascript',
          src: 'http://localhost:10200/byte-efficiency/script.js',
          async: false,
          defer: false,
          source: 'head',
        },
        {
          type: null,
          src: 'http://localhost:10200/byte-efficiency/bundle.js',
          async: false,
          defer: false,
          source: 'head',
        },
        {
          type: null,
          src: null,
          async: false,
          defer: false,
          source: 'body',
          content: /shadowRoot/,
        },
        {
          type: null,
          src: null,
          async: false,
          defer: false,
          source: 'body',
          content: /generateInlineStyleWithSize/,
        },
        {
          type: null,
          src: null,
          async: false,
          defer: false,
          source: 'body',
          content: /Used block #1/,
        },
        {
          type: null,
          src: null,
          async: false,
          defer: false,
          source: 'body',
          content: /Unused block #1/,
        },
        {
          type: null,
          src: 'http://localhost:10200/byte-efficiency/delay-complete.js?delay=8000',
          async: true,
          defer: false,
          source: 'body',
        },
      ],
      JsUsage: {
        // ScriptParsedEvent.embedderName wasn't added to the protocol until M86,
        // and `some-custom-url.js` won't show without it.
        // https://chromiumdash.appspot.com/commit/52ed57138d0b83e8afd9de25e60655c6ace7527c
        '_minChromiumMilestone': 86,
        'http://localhost:10200/byte-efficiency/tester.html': [
          {url: 'http://localhost:10200/byte-efficiency/tester.html'},
          {url: 'http://localhost:10200/byte-efficiency/tester.html'},
          {url: 'http://localhost:10200/byte-efficiency/tester.html'},
          {url: 'http://localhost:10200/byte-efficiency/tester.html'},
          {url: '/some-custom-url.js'},
        ],
        'http://localhost:10200/byte-efficiency/script.js': [
          {url: 'http://localhost:10200/byte-efficiency/script.js'},
        ],
        'http://localhost:10200/byte-efficiency/bundle.js': [
          {url: 'http://localhost:10200/byte-efficiency/bundle.js'},
        ],
      },
    },
    lhr: {
      requestedUrl: 'http://localhost:10200/byte-efficiency/tester.html',
      finalUrl: 'http://localhost:10200/byte-efficiency/tester.html',
      audits: {
        'uses-http2': {
          score: 1,
          details: {
            items: {
              // localhost gets a free pass on uses-h2
              length: 0,
            },
          },
        },
        'unminified-css': {
          details: {
            overallSavingsBytes: '>17000',
            items: {
              length: 2,
            },
          },
        },
        'unminified-javascript': {
          score: '<1',
          details: {
            // the specific ms value is not meaningful for this smoketest
            // *some largish amount* of savings should be reported
            overallSavingsMs: '>500',
            overallSavingsBytes: '>45000',
            items: [
              {
                url: 'http://localhost:10200/byte-efficiency/script.js',
                wastedBytes: '46481 +/- 100',
                wastedPercent: '87 +/- 5',
              },
              {
                url: 'inline: \n  function unusedFunction() {\n    // Un...',
                wastedBytes: '6700 +/- 100',
                wastedPercent: '99.6 +/- 0.1',
              },
              {
                url: 'inline: \n  // Used block #1\n  // FILLER DATA JUS...',
                wastedBytes: '6559 +/- 100',
                wastedPercent: 100,
              },
              {
                url: 'http://localhost:10200/byte-efficiency/bundle.js',
                totalBytes: '13000 +/- 1000',
                wastedBytes: '2350 +/- 100',
                wastedPercent: '19 +/- 5',
              },
            ],
          },
        },
        'unused-css-rules': {
          details: {
            overallSavingsBytes: '>40000',
            items: {
              length: 2,
            },
          },
        },
        'unused-javascript': {
          // ScriptParsedEvent.embedderName wasn't added to the protocol until M86.
          // https://chromiumdash.appspot.com/commit/52ed57138d0b83e8afd9de25e60655c6ace7527c
          _minChromiumMilestone: 86,
          score: '<1',
          details: {
            // the specific ms value here is not meaningful for this smoketest
            // *some* savings should be reported
            overallSavingsMs: '>0',
            overallSavingsBytes: '35000 +/- 1000',
            items: [
              {
                url: 'http://localhost:10200/byte-efficiency/script.js',
                totalBytes: '53000 +/- 1000',
                wastedBytes: '22000 +/- 1000',
              },
              {
                url: 'http://localhost:10200/byte-efficiency/tester.html',
                totalBytes: '15000 +/- 1000',
                wastedBytes: '6500 +/- 1000',
              },
              {
                url: 'http://localhost:10200/byte-efficiency/bundle.js',
                totalBytes: '12913 +/- 1000',
                wastedBytes: '5827 +/- 200',
                subItems: {
                  items: [
                    {source: '…./b.js', sourceBytes: '4417 +/- 50', sourceWastedBytes: '2191 +/- 50'},
                    {source: '…./c.js', sourceBytes: '2200 +/- 50', sourceWastedBytes: '2182 +/- 50'},
                    {source: '…webpack/bootstrap', sourceBytes: '2809 +/- 50', sourceWastedBytes: '1259 +/- 50'},
                  ],
                },
              },
            ],
          },
        },
        'offscreen-images': {
          details: {
            items: [
              {
                url: /lighthouse-unoptimized.jpg$/,
              }, {
                url: /lighthouse-480x320.webp$/,
              }, {
                url: /lighthouse-480x320.webp\?invisible$/,
              }, {
                url: /large.svg$/,
              },
            ],
          },
        },
        'uses-webp-images': {
          details: {
            overallSavingsBytes: '>60000',
            items: {
              length: 6,
            },
          },
        },
        'uses-text-compression': {
          score: '<1',
          details: {
            // the specific ms value is not meaningful for this smoketest
            // *some largish amount* of savings should be reported
            overallSavingsMs: '>700',
            overallSavingsBytes: '>50000',
            items: {
              length: 3,
            },
          },
        },
        'uses-optimized-images': {
          details: {
            overallSavingsBytes: '>10000',
            items: {
              length: 1,
            },
          },
        },
        // Check that images aren't TOO BIG.
        'uses-responsive-images': {
          details: {
            overallSavingsBytes: '113000 +/- 5000',
            items: [
              {wastedPercent: '56 +/- 5', url: /lighthouse-1024x680.jpg/},
              {wastedPercent: '78 +/- 5', url: /lighthouse-2048x1356.webp\?size0/},
              {wastedPercent: '56 +/- 5', url: /lighthouse-480x320.webp/},
              {wastedPercent: '20 +/- 5', url: /lighthouse-480x320.jpg/},
              {wastedPercent: '20 +/- 5', url: /lighthouse-480x320\.jpg\?attributesized/},
            ],
          },
        },
        // Checks that images aren't TOO SMALL.
        'image-size-responsive': {
          details: {
            items: [
              // One of these is the ?duplicate variant and another is the
              // ?cssauto variant but sort order isn't guaranteed
              // since the pixel diff is equivalent for identical images.
              {url: /lighthouse-320x212-poor.jpg/},
              {url: /lighthouse-320x212-poor.jpg/},
              {url: /lighthouse-320x212-poor.jpg/},
            ],
          },
        },
        'unsized-images': {
          details: {
            items: [
              {url: /lighthouse-320x212-poor\.jpg/},
              {url: /lighthouse-320x212-poor\.jpg\?cssauto/},
            ],
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/byte-efficiency/gzip.html',
      finalUrl: 'http://localhost:10200/byte-efficiency/gzip.html',
      audits: {
        'network-requests': {
          details: {
            items: [
              {
                url: 'http://localhost:10200/byte-efficiency/gzip.html',
                finished: true,
              },
              {
                url: 'http://localhost:10200/byte-efficiency/script.js?gzip=1',
                transferSize: '1200 +/- 150',
                resourceSize: '53000 +/- 1000',
                finished: true,
              },
              {
                url: 'http://localhost:10200/byte-efficiency/script.js',
                transferSize: '53200 +/- 1000',
                resourceSize: '53000 +/- 1000',
                finished: true,
              },
              {
                url: 'http://localhost:10200/favicon.ico',
                finished: true,
              },
            ],
          },
        },
      },
    },
  },
];

module.exports = expectations;
