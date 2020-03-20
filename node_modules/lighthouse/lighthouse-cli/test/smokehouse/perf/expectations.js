/**
 * @license Copyright 2017 Google Inc. All Rights Reserved.
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
        'time-to-first-byte': {
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
          score: '<1',
          warnings: {
            0: /fonts.googleapis/,
            length: 1,
          },
          details: {
            items: {
              length: 1,
            },
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
          displayValue: '11 requests • 164 KB',
          details: {
            items: [
              {resourceType: 'total', requestCount: 11, size: '168000±1000'},
              {resourceType: 'font', requestCount: 2, size: '80000±1000'},
              {resourceType: 'script', requestCount: 3, size: '55000±1000'},
              {resourceType: 'image', requestCount: 2, size: '28000±1000'},
              {resourceType: 'document', requestCount: 1, size: '2200±100'},
              {resourceType: 'other', requestCount: 2, size: '1300±50'},
              {resourceType: 'stylesheet', requestCount: 1, size: '450±100'},
              {resourceType: 'media', requestCount: 0, size: 0},
              {resourceType: 'third-party', requestCount: 0, size: 0},
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
                countOverBudget: '3 requests',
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
                sizeOverBudget: '1150±50',
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
                countOverBudget: '1 request',
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
            items: {
              length: 2,
            },
          },
        },
      },
    },
  },
];
