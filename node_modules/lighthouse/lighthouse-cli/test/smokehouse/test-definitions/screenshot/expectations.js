/**
 * @license Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 */
const expectations = [
  {
    artifacts: {
      FullPageScreenshot: {
        screenshot: {
          width: '>1000',
          height: '>1000',
          data: /data:image\/jpeg;base64,.{10000,}$/,
        },
        nodes: {
          'page-0-BODY': {
            top: 8,
            bottom: 1008,
            left: 8,
            right: 1008,
            width: 1000,
            height: 1000,
          },
          // The following 2 are the same element (from different JS contexts). This element
          // starts with height ~18 and grows over time. See screenshot.html.
          'page-1-P': {
            top: 8,
            left: 8,
            height: '>40',
          },
          // Note: The first number (5) in these ids comes from an executionContextId, and has the potential to change
          '5-1-P': {
            top: 8,
            left: 8,
            height: '>40',
          },
          '5-2-BODY': {
            top: 8,
            bottom: 1008,
            left: 8,
            right: 1008,
            width: 1000,
            height: 1000,
          },
          '5-3-HTML': {},
        },
      },
    },
    lhr: {
      requestedUrl: 'http://localhost:10200/screenshot.html?width=1000px&height=1000px',
      finalUrl: 'http://localhost:10200/screenshot.html?width=1000px&height=1000px',
      audits: {},
    },
  },
];

module.exports = expectations;
