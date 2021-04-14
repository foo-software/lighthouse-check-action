/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 * Expected Lighthouse audit values for perf tests.
 */
module.exports = [
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/preload.html',
      finalUrl: 'http://localhost:10200/preload.html',
      audits: {
        'speed-index': {
          score: '>=0.80', // primarily just making sure it didn't fail/go crazy, specific value isn't that important
        },
        'first-meaningful-paint': {
          score: '>=0.90', // primarily just making sure it didn't fail/go crazy, specific value isn't that important
        },
        'first-cpu-idle': {
          score: '>=0.90', // primarily just making sure it didn't fail/go crazy, specific value isn't that important
        },
        'interactive': {
          score: '>=0.90', // primarily just making sure it didn't fail/go crazy, specific value isn't that important
        },
        'server-response-time': {
          // Can be flaky, so test float numericValue instead of binary score
          numericValue: '<1000',
        },
        'network-requests': {
          details: {
            items: {
              length: '>5',
            },
          },
        },
        'uses-rel-preload': {
          score: '<1',
          numericValue: '>500',
          warnings: {
            0: /level-2.*warning/,
            length: 1,
          },
          details: {
            items: {
              length: 1,
            },
          },
        },
        'uses-rel-preconnect': {
          score: 1,
          warnings: {
            0: /fonts.googleapis/,
            length: 1,
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/perf-budgets/load-things.html',
      finalUrl: 'http://localhost:10200/perf/perf-budgets/load-things.html',
      audits: {
        'resource-summary': {
          score: null,
          displayValue: '10 requests • 164 KiB',
          details: {
            items: [
              {resourceType: 'total', requestCount: 10, transferSize: '168000±1000'},
              {resourceType: 'font', requestCount: 2, transferSize: '81000±1000'},
              {resourceType: 'script', requestCount: 3, transferSize: '55000±1000'},
              {resourceType: 'image', requestCount: 2, transferSize: '28000±1000'},
              {resourceType: 'document', requestCount: 1, transferSize: '2200±100'},
              {resourceType: 'other', requestCount: 1, transferSize: '1030±100'},
              {resourceType: 'stylesheet', requestCount: 1, transferSize: '450±100'},
              {resourceType: 'media', requestCount: 0, transferSize: 0},
              {resourceType: 'third-party', requestCount: 0, transferSize: 0},
            ],
          },
        },
        'performance-budget': {
          score: null,
          details: {
            // Undefined items are asserting that the property isn't included in the table item.
            items: [
              {
                resourceType: 'total',
                countOverBudget: '2 requests',
                sizeOverBudget: '65000±1000',
              },
              {
                resourceType: 'script',
                countOverBudget: '2 requests',
                sizeOverBudget: '25000±1000',
              },
              {
                resourceType: 'font',
                countOverBudget: undefined,
                sizeOverBudget: '4000±500',
              },
              {
                resourceType: 'document',
                countOverBudget: '1 request',
                sizeOverBudget: '1200±50',
              },
              {
                resourceType: 'stylesheet',
                countOverBudget: undefined,
                sizeOverBudget: '450±100',
              },
              {
                resourceType: 'image',
                countOverBudget: '1 request',
                sizeOverBudget: undefined,
              },
              {
                resourceType: 'media',
                countOverBudget: undefined,
                sizeOverBudget: undefined,
              },
              {
                resourceType: 'other',
                countOverBudget: undefined,
                sizeOverBudget: undefined,
              },
              {
                resourceType: 'third-party',
                countOverBudget: undefined,
                sizeOverBudget: undefined,
              },
            ],
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/fonts.html',
      finalUrl: 'http://localhost:10200/perf/fonts.html',
      audits: {
        'font-display': {
          score: 0,
          details: {
            items: [
              {
                url: 'http://localhost:10200/perf/lobster-v20-latin-regular.woff2',
              },
            ],
          },
        },
        'preload-fonts': {
          score: 0,
          details: {
            items: [
              {
                url: 'http://localhost:10200/perf/lobster-two-v10-latin-700.woff2?delay=1000',
              },
            ],
          },
        },
      },
    },
  },
  {
    artifacts: {
      TraceElements: [
        {
          traceEventType: 'largest-contentful-paint',
          node: {
            nodeLabel: 'img',
            snippet: '<img src="../dobetterweb/lighthouse-480x318.jpg">',
            boundingRect: {
              top: 108,
              bottom: 426,
              left: 8,
              right: 488,
              width: 480,
              height: 318,
            },
          },
        },
        {
          traceEventType: 'layout-shift',
          node: {
            selector: 'body > h1',
            nodeLabel: 'Please don\'t move me',
            snippet: '<h1>',
            boundingRect: {
              top: 465,
              bottom: 502,
              left: 8,
              right: 352,
              width: 344,
              height: 37,
            },
          },
          score: '0.058 +/- 0.01',
        },
        {
          traceEventType: 'layout-shift',
          node: {
            nodeLabel: 'Sorry!',
            snippet: '<div style="height: 18px;">',
            boundingRect: {
              top: 426,
              bottom: 444,
              left: 8,
              right: 352,
              width: 344,
              height: 18,
            },
          },
          score: '0.026 +/- 0.01',
        },
        {
          // Requires compositor failure reasons to be in the trace
          // for `failureReasonsMask` and `unsupportedProperties`
          // https://chromiumdash.appspot.com/commit/995baabedf9e70d16deafc4bc37a2b215a9b8ec9
          _minChromiumMilestone: 86,
          traceEventType: 'animation',
          node: {
            selector: 'body > div#animate-me',
            nodeLabel: 'This is changing font size',
            snippet: '<div id="animate-me">',
            boundingRect: {
              top: 8,
              bottom: 108,
              left: 8,
              right: 108,
              width: 100,
              height: 100,
            },
          },
          animations: [
            {
              name: 'anim',
              failureReasonsMask: 8224,
              unsupportedProperties: ['font-size'],
            },
          ],
        },
      ],
    },
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/trace-elements.html',
      finalUrl: 'http://localhost:10200/perf/trace-elements.html',
      audits: {
        'largest-contentful-paint-element': {
          score: null,
          displayValue: '1 element found',
          details: {
            items: [
              {
                node: {
                  type: 'node',
                  nodeLabel: 'img',
                  path: '0,HTML,1,BODY,1,DIV,a,#document-fragment,0,SECTION,0,IMG',
                },
              },
            ],
          },
        },
        'layout-shift-elements': {
          score: null,
          displayValue: '2 elements found',
          details: {
            items: {
              length: 2,
            },
          },
        },
        'long-tasks': {
          score: null,
          details: {
            items: {
              0: {
                url: 'http://localhost:10200/perf/delayed-element.js',
                duration: '>500',
                startTime: '5000 +/- 5000', // make sure it's on the right time scale, but nothing more
              },
            },
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/frame-metrics.html',
      finalUrl: 'http://localhost:10200/perf/frame-metrics.html',
      audits: {
        'metrics': {
          score: null,
          details: {
            type: 'debugdata',
            items: [
              {
                // Weighted CLS score was added to the trace in m90:
                // https://bugs.chromium.org/p/chromium/issues/detail?id=1173139
                _minChromiumMilestone: 90,
                firstContentfulPaint: '>5000',
                firstContentfulPaintAllFrames: '<5000',
                largestContentfulPaint: '>5000',
                largestContentfulPaintAllFrames: '<5000',
                cumulativeLayoutShift: '0.001 +/- 0.0005',
                cumulativeLayoutShiftAllFrames: '0.0276 +/- 0.0005',
                layoutShiftAvgSessionGap5s: '>0',
                layoutShiftMaxSessionGap1s: '>0',
                layoutShiftMaxSessionGap1sLimit5s: '>0',
                layoutShiftMaxSliding1s: '>0',
                layoutShiftMaxSliding300ms: '>0',
              },
              {
                lcpInvalidated: false,
              },
            ],
          },
        },
      },
    },
  },
];
