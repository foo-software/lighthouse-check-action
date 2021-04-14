/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 * Expected Lighthouse audit values for perf diagnostics tests which do not need to be run serially.
 */
module.exports = [
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/animations.html',
      finalUrl: 'http://localhost:10200/perf/animations.html',
      audits: {
        'non-composited-animations': {
          // Requires compositor failure reasons to be in the trace
          // https://chromiumdash.appspot.com/commit/995baabedf9e70d16deafc4bc37a2b215a9b8ec9
          _minChromiumMilestone: 86,
          score: null,
          displayValue: '1 animated element found',
          details: {
            items: [
              {
                node: {
                  type: 'node',
                  path: '2,HTML,1,BODY,1,DIV',
                  selector: 'body > div#animated-boi',
                  nodeLabel: 'This is changing font size',
                  snippet: '<div id="animated-boi">',
                },
                subItems: {
                  items: [
                    {
                      // From JavaScript `.animate` which has no animation display name
                      failureReason: 'Unsupported CSS Property: width',
                    },
                    {
                      failureReason: 'Unsupported CSS Property: height',
                      animation: 'alpha',
                    },
                    {
                      failureReason: 'Unsupported CSS Property: font-size',
                      animation: 'beta',
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/perf/third-party.html',
      finalUrl: 'http://localhost:10200/perf/third-party.html',
      audits: {
        'third-party-facades': {
          score: 0,
          displayValue: '1 facade alternative available',
          details: {
            items: [
              {
                product: 'YouTube Embedded Player (Video)',
                blockingTime: 0, // Note: Only 0 if the iframe was out-of-process
                transferSize: '>400000', // Transfer size is imprecise.
                subItems: {
                  type: 'subitems',
                  items: {
                    length: '>5', // We don't care exactly how many it has, just ensure we surface the subresources.
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];
