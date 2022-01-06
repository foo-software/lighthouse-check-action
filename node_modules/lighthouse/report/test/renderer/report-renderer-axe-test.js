/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import puppeteer from 'puppeteer';

import sampleResults from '../../../lighthouse-core/test/results/sample_v2.json';
import reportGenerator from '../../generator/report-generator.js';
import axeLib from '../../../lighthouse-core/lib/axe.js';

describe('ReportRendererAxe', () => {
  describe('with aXe', () => {
    let browser;

    beforeAll(async () => {
      browser = await puppeteer.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('renders without axe violations', async () => {
      const page = await browser.newPage();
      const htmlReport = reportGenerator.generateReportHtml(sampleResults);
      await page.setContent(htmlReport);

      // Superset of Lighthouse's aXe config
      const config = {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
          ],
        },
        resultTypes: ['violations', 'inapplicable'],
        rules: {
          'tabindex': {enabled: true},
          'accesskeys': {enabled: true},
          'heading-order': {enabled: true},
          'meta-viewport': {enabled: true},
          'aria-treeitem-name': {enabled: true},
        },
      };

      await page.evaluate(axeLib.source);
      // eslint-disable-next-line no-undef
      const axeResults = await page.evaluate(config => axe.run(config), config);

      expect(axeResults.violations).toMatchObject([
        // Color contrast failure only pops up if this pptr is run headfully.
        // There are currently 27 problematic nodes, primarily audit display text and explanations.
        // TODO: fix these failures, regardless.
        // {
        //   id: 'color-contrast',
        // },
        {
          id: 'duplicate-id',
          nodes: [
            // We use these audits in multiple categories. Makes sense.
            {html: '<div class="lh-audit lh-audit--binary lh-audit--pass" id="viewport">'},
            {html: '<div class="lh-audit lh-audit--binary lh-audit--fail" id="image-alt">'},
            {html: '<div class="lh-audit lh-audit--binary lh-audit--pass" id="document-title">'},
          ],
        },
      ]);
    },
    // This test takes 10s on fast hardware, but can take longer in CI.
    // https://github.com/dequelabs/axe-core/tree/b573b1c1/doc/examples/jest_react#timeout-issues
    /* timeout= */ 20_000
    );
  });
});
