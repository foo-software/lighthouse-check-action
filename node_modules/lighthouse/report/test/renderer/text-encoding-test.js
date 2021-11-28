/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

import fs from 'fs';

import pako from 'pako';

import {TextEncoding} from '../../renderer/text-encoding.js';
import {LH_ROOT} from '../../../root.js';

/* eslint-env jest */

describe('TextEncoding', () => {
  beforeAll(() => {
    global.window = {pako};
  });

  afterAll(() => {
    global.window = undefined;
  });

  /** @type {string} */
  async function test(str) {
    for (const gzip of [false, true]) {
      const binary = await TextEncoding.toBase64(str, {gzip});
      const roundtrip = TextEncoding.fromBase64(binary, {gzip});
      expect(roundtrip.length).toEqual(str.length);
      expect(roundtrip).toEqual(str);
    }
  }

  it('works', async () => {
    await test('');
    await test('hello');
    await test('😃');
    await test('{åß∂œ∑´}');
    await test('Some examples of emoji are 😃, 🧘🏻‍♂️, 🌍, 🍞, 🚗, 📞, 🎉, ♥️, 🍆, and 🏁.');
    await test('.'.repeat(125183));
    await test('😃'.repeat(125183));
    await test(fs.readFileSync(LH_ROOT + '/treemap/app/debug.json', 'utf-8'));
  });
});
