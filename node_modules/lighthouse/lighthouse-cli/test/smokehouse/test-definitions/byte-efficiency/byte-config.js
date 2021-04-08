/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {LH.Config.Json}
 * Config file for running byte efficiency smokehouse audits.
 */
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'accesskeys', // run axe on the page since we've had problems with interactions
      'network-requests',
      'offscreen-images',
      'uses-http2',
      'uses-webp-images',
      'uses-optimized-images',
      'uses-text-compression',
      'uses-responsive-images',
      'unminified-css',
      'unminified-javascript',
      'unused-css-rules',
      'unused-javascript',
      // image-size-responsive is not a byte-efficiency audit but a counterbalance to the byte-efficiency audits
      // that makes sense to test together.
      'image-size-responsive',
      // unsized-images is not a byte-efficiency audit but can easily leverage the variety of images present in
      // byte-efficiency tests & thus makes sense to test together.
      'unsized-images',
    ],
    throttlingMethod: 'devtools',
  },
  audits: [
    'unsized-images',
    {path: 'byte-efficiency/unused-javascript', options: {
      // Lower the threshold so we don't need huge resources to make a test.
      unusedThreshold: 2000,
    }},
  ],
};

module.exports = config;
