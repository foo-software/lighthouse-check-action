/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {jest} from '@jest/globals';
import puppeteer, {Browser, Page} from 'puppeteer';

import ReportGenerator from '../../report/generator/report-generator.js';
import {flowResult} from './sample-flow';

jest.setTimeout(35_000);

describe('Lighthouse Flow Report', () => {
  console.log('\n✨ Be sure to have recently run this: yarn build-report');

  let browser: Browser;
  let page: Page;
  const pageErrors: Error[] = [];

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
    });
    page = await browser.newPage();
    page.on('pageerror', pageError => pageErrors.push(pageError));
  });

  afterAll(async () => {
    if (pageErrors.length > 0) console.error(pageErrors);

    await browser.close();
  });

  describe('Renders the flow report', () => {
    beforeAll(async () => {
      const html = ReportGenerator.generateFlowReportHtml(flowResult);
      await page.setContent(html);
    });

    it('should load with no errors', async () => {
      expect(pageErrors).toHaveLength(0);
    });
  });
});
