/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * Expected Lighthouse audit values for sites with polyfills.
 */
module.exports = [
  {
    lhr: {
      requestedUrl: 'http://localhost:10200/legacy-javascript.html',
      finalUrl: 'http://localhost:10200/legacy-javascript.html',
      audits: {
        'legacy-javascript': {
          details: {
            items: [
              {
                url: 'http://localhost:10200/legacy-javascript.js',
                wastedBytes: '78000 +/- 2000',
                subItems: {
                  items: [
                    {signal: 'Array.prototype.fill'},
                    {signal: 'Array.prototype.filter'},
                    {signal: 'Array.prototype.findIndex'},
                    {signal: 'Array.prototype.find'},
                    {signal: 'Array.prototype.forEach'},
                    {signal: 'Array.from'},
                    {signal: 'Array.prototype.includes'},
                    {signal: 'Array.isArray'},
                    {signal: 'Array.prototype.map'},
                    {signal: 'Array.of'},
                    {signal: 'Array.prototype.reduceRight'},
                    {signal: 'Array.prototype.reduce'},
                    {signal: 'Array.prototype.some'},
                    {signal: 'Date.now'},
                    {signal: 'Date.prototype.toISOString'},
                    {signal: 'Date.prototype.toJSON'},
                    {signal: 'Number.isInteger'},
                    {signal: 'Number.isSafeInteger'},
                    {signal: 'Number.parseInt'},
                    {signal: 'Object.defineProperties'},
                    {signal: 'Object.defineProperty'},
                    {signal: 'Object.entries'},
                    {signal: 'Object.freeze'},
                    {signal: 'Object.getOwnPropertyDescriptors'},
                    {signal: 'Object.getOwnPropertyNames'},
                    {signal: 'Object.getPrototypeOf'},
                    {signal: 'Object.isExtensible'},
                    {signal: 'Object.isFrozen'},
                    {signal: 'Object.isSealed'},
                    {signal: 'Object.keys'},
                    {signal: 'Object.preventExtensions'},
                    {signal: 'Object.seal'},
                    {signal: 'Object.setPrototypeOf'},
                    {signal: 'Object.values'},
                    {signal: 'Reflect.apply'},
                    {signal: 'Reflect.construct'},
                    {signal: 'Reflect.defineProperty'},
                    {signal: 'Reflect.deleteProperty'},
                    {signal: 'Reflect.getOwnPropertyDescriptor'},
                    {signal: 'Reflect.getPrototypeOf'},
                    {signal: 'Reflect.get'},
                    {signal: 'Reflect.has'},
                    {signal: 'Reflect.isExtensible'},
                    {signal: 'Reflect.ownKeys'},
                    {signal: 'Reflect.preventExtensions'},
                    {signal: 'Reflect.setPrototypeOf'},
                    {signal: 'String.prototype.codePointAt'},
                    {signal: 'String.fromCodePoint'},
                    {signal: 'String.raw'},
                    {signal: 'String.prototype.repeat'},
                    {signal: '@babel/plugin-transform-classes'},
                    {signal: '@babel/plugin-transform-regenerator'},
                    {signal: '@babel/plugin-transform-spread'},
                  ],
                },
              },
              {
                url: 'http://localhost:10200/legacy-javascript.html',
                subItems: {
                  items: [
                    {signal: 'Array.prototype.findIndex'},
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
];
