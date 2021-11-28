/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {jest} from '@jest/globals';
import {JSDOM} from 'jsdom';

/**
 * The jest environment "jsdom" does not work when preact is combined with the report renderer.
 * This sets up our own environment with JSDOM globals.
 */
beforeEach(() => {
  const {window} = new JSDOM(undefined, {
    url: 'file:///Users/example/report.html/',
  });
  global.window = window as any;
  global.document = window.document;
  global.location = window.location;
  global.self = global.window;

  // Use JSDOM types as necessary.
  global.Blob = window.Blob;
  global.HTMLInputElement = window.HTMLInputElement;

  // Functions not implemented in JSDOM.
  window.Element.prototype.scrollIntoView = jest.fn();
  global.self.matchMedia = jest.fn<any, any>(() => ({
    addListener: jest.fn(),
  }));
});
