/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 * Expected Lighthouse audit values for lantern smoketests
 */
module.exports = [
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/online-only.html',
      finalUrl: 'http://localhost:10200/online-only.html',
      audits: {
        'first-contentful-paint': {
          numericValue: '>2000',
        },
        'first-cpu-idle': {
          numericValue: '>2000',
        },
        'interactive': {
          numericValue: '>2000',
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/tricky-main-thread.html?setTimeout',
      finalUrl: 'http://localhost:10200/tricky-main-thread.html?setTimeout',
      audits: {
        'interactive': {
          // Make sure all of the CPU time is reflected in the perf metrics as well.
          // The scripts stalls for 3 seconds and lantern has a 4x multiplier so 12s minimum.
          numericValue: '>12000',
        },
        'bootup-time': {
          details: {
            items: {
              0: {
                url: /main-thread-consumer/,
                scripting: '>1000',
              },
            },
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/tricky-main-thread.html?fetch',
      finalUrl: 'http://localhost:10200/tricky-main-thread.html?fetch',
      audits: {
        'interactive': {
          // Make sure all of the CPU time is reflected in the perf metrics as well.
          // The scripts stalls for 3 seconds and lantern has a 4x multiplier so 12s minimum.
          numericValue: '>12000',
        },
        'bootup-time': {
          details: {
            items: {
              0: {
              // TODO: requires sampling profiler and async stacks, see https://github.com/GoogleChrome/lighthouse/issues/8526
              // url: /main-thread-consumer/,
                scripting: '>1000',
              },
            },
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/tricky-main-thread.html?xhr',
      finalUrl: 'http://localhost:10200/tricky-main-thread.html?xhr',
      audits: {
        'interactive': {
          // Make sure all of the CPU time is reflected in the perf metrics as well.
          // The scripts stalls for 3 seconds and lantern has a 4x multiplier so 12s minimum.
          numericValue: '>12000',
        },
        'bootup-time': {
          details: {
            items: {
              0: {
                url: /main-thread-consumer/,
                scripting: '>9000',
              },
            },
          },
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/ric-shim.html?short',
      finalUrl: 'http://localhost:10200/ric-shim.html?short',
      audits: {
        'total-blocking-time': {
          // With the requestIdleCallback shim in place 1ms tasks should not block at all and should max add up to
          // 12.5 ms each, which would result in 50ms under a 4x simulated throttling multiplier and therefore in 0 tbt
          numericValue: '<=100',
        },
      },
    },
  },
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/ric-shim.html?long',
      finalUrl: 'http://localhost:10200/ric-shim.html?long',
      audits: {
        'total-blocking-time': {
          // With a 4x throttling multiplier in place each 50ms task takes 200ms, which results in 150ms blocking time
          // each. We iterate ~40 times, so the true amount of blocking time we expect is ~6s, but
          // sometimes Chrome's requestIdleCallback won't fire the full 40 if the machine is under load,
          // so be generous with how much slack to give in the expectations.
          numericValue: '>2500',
        },
      },
    },
  },
];
