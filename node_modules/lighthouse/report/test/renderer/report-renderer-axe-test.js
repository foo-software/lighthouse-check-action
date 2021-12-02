/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import jsdom from 'jsdom';
import {jest} from '@jest/globals';

import {Util} from '../../renderer/util.js';
import {DOM} from '../../renderer/dom.js';
import {DetailsRenderer} from '../../renderer/details-renderer.js';
import {CategoryRenderer} from '../../renderer/category-renderer.js';
import {ReportRenderer} from '../../renderer/report-renderer.js';
import sampleResultsOrig from '../../../lighthouse-core/test/results/sample_v2.json';

describe('ReportRendererAxe', () => {
  describe('with aXe', () => {
    let axe;
    let renderer;
    let sampleResults;

    beforeAll(async () => {
      global.console.warn = jest.fn();

      const {window} = new jsdom.JSDOM();
      const dom = new DOM(window.document);
      const detailsRenderer = new DetailsRenderer(dom);
      const categoryRenderer = new CategoryRenderer(dom, detailsRenderer);
      renderer = new ReportRenderer(dom, categoryRenderer);
      sampleResults = Util.prepareReportResult(sampleResultsOrig);

      // Needed by axe-core
      // https://github.com/dequelabs/axe-core/blob/581c441c/doc/examples/jsdom/test/a11y.js#L24
      global.window = global.self = window;
      global.Node = global.self.Node;
      global.Element = global.self.Element;

      // axe-core must be imported after the global polyfills
      axe = (await import('axe-core')).default;
    });

    afterAll(() => {
      global.window = undefined;
      global.Node = undefined;
      global.Element = undefined;
    });

    it('renders without axe violations', async () => {
      const container = renderer._dom.document().createElement('main');
      const output = renderer.renderReport(sampleResults, container);

      renderer._dom.document().body.appendChild(container);

      const config = {
        rules: {
          // Reports may have duplicate ids
          // https://github.com/GoogleChrome/lighthouse/issues/9432
          'duplicate-id': {enabled: false},
          'duplicate-id-aria': {enabled: false},
          'landmark-no-duplicate-contentinfo': {enabled: false},
          // The following rules are disable for axe-core + jsdom compatibility
          // https://github.com/dequelabs/axe-core/tree/b573b1c1/doc/examples/jest_react#to-run-the-example
          'color-contrast': {enabled: false},
          'link-in-text-block': {enabled: false},
          // Report has empty links prior to i18n-ing.
          'link-name': {enabled: false},
          // May not be a real issue. https://github.com/dequelabs/axe-core/issues/2958
          'nested-interactive': {enabled: false},
        },
      };

      const axeResults = await axe.run(output, config);
      expect(axeResults.violations).toEqual([]);
    },
    // This test takes 40s on fast hardware, and 50-60s on GHA (but can take longer).
    // https://github.com/dequelabs/axe-core/tree/b573b1c1/doc/examples/jest_react#timeout-issues
    /* timeout= */ process.env.CI ? 200_000 : 60_000
    );
  });
});
