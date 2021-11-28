/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

'use strict';

import fs from 'fs';

import jsdom from 'jsdom';
import {jest} from '@jest/globals';

import * as lighthouseRenderer from '../../clients/bundle.js';
import {LH_ROOT} from '../../../root.js';

const sampleResultsStr =
  fs.readFileSync(LH_ROOT + '/lighthouse-core/test/results/sample_v2.json', 'utf-8');


/* eslint-env jest */

describe('lighthouseRenderer bundle', () => {
  let document;
  beforeAll(() => {
    global.console.warn = jest.fn();

    const {window} = new jsdom.JSDOM();
    document = window.document;

    global.window = global.self = window;
    global.window.requestAnimationFrame = fn => fn();
    global.HTMLInputElement = window.HTMLInputElement;
    // Stub out matchMedia for Node.
    global.self.matchMedia = function() {
      return {
        addListener: function() {},
      };
    };
    global.window.ResizeObserver = class ResizeObserver {
      observe() { }
      unobserve() { }
    };
  });

  afterAll(() => {
    global.window = global.self = undefined;
    global.HTMLInputElement = undefined;
  });

  it('renders an LHR to DOM', () => {
    const lhr = /** @type {LH.Result} */ JSON.parse(sampleResultsStr);
    const reportContainer = document.body;
    reportContainer.classList.add('lh-vars', 'lh-root');

    const dom = new lighthouseRenderer.DOM(reportContainer.ownerDocument);
    const renderer = new lighthouseRenderer.ReportRenderer(dom);
    renderer.renderReport(lhr, reportContainer);
    const features = new lighthouseRenderer.ReportUIFeatures(renderer._dom);
    features.initFeatures(lhr);

    // Check that the report exists and has some content.
    expect(reportContainer instanceof document.defaultView.Element).toBeTruthy();
    expect(reportContainer.outerHTML.length).toBeGreaterThan(50000);

    const title = reportContainer.querySelector('.lh-audit-group--metrics')
      .querySelector('.lh-audit-group__title');
    expect(title.textContent).toEqual('Metrics');
  });
});
