/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import {strict as assert} from 'assert';

import jsdom from 'jsdom';
import {jest} from '@jest/globals';

import {Util} from '../../renderer/util.js';
import URL from '../../../lighthouse-core/lib/url-shim.js';
import {DOM} from '../../renderer/dom.js';
import {DetailsRenderer} from '../../renderer/details-renderer.js';
import {CategoryRenderer} from '../../renderer/category-renderer.js';
import {ReportRenderer} from '../../renderer/report-renderer.js';
import sampleResultsOrig from '../../../lighthouse-core/test/results/sample_v2.json';

const TIMESTAMP_REGEX = /\d+, \d{4}.*\d+:\d+/;

describe('ReportRenderer', () => {
  let renderer;
  let sampleResults;

  beforeAll(() => {
    global.console.warn = jest.fn();

    // Stub out matchMedia for Node.
    global.matchMedia = function() {
      return {
        addListener: function() {},
      };
    };

    const {window} = new jsdom.JSDOM();
    global.self = window;

    const dom = new DOM(window.document);
    const detailsRenderer = new DetailsRenderer(dom);
    const categoryRenderer = new CategoryRenderer(dom, detailsRenderer);
    renderer = new ReportRenderer(dom, categoryRenderer);
    sampleResults = Util.prepareReportResult(sampleResultsOrig);
  });

  afterAll(() => {
    global.self = undefined;
    global.matchMedia = undefined;
  });

  describe('renderReport', () => {
    it('should render a report', () => {
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(sampleResults, container);
      assert.ok(output.querySelector('.lh-header-container'), 'has a header');
      assert.ok(output.querySelector('.lh-report'), 'has report body');
      // 3 sets of gauges - one in sticky header, one in scores header, and one in each section.
      assert.equal(output.querySelectorAll('.lh-gauge__wrapper, .lh-gauge--pwa__wrapper').length,
          Object.keys(sampleResults.categories).length * 3, 'renders category gauges');
    });

    it('renders additional reports by replacing the existing one', () => {
      const container = renderer._dom.document().body;
      const oldReport = Array.from(renderer.renderReport(sampleResults, container).children);
      const newReport = Array.from(renderer.renderReport(sampleResults, container).children);
      assert.ok(!oldReport.find(node => container.contains(node)), 'old report was removed');
      assert.ok(newReport.find(node => container.contains(node)),
        'new report appended to container');
    });

    it('renders a topbar', () => {
      const topbar = renderer._renderReportTopbar(sampleResults);
      assert.equal(topbar.querySelector('.lh-topbar__url').textContent, sampleResults.finalUrl);
    });

    it('renders a header', () => {
      const header = renderer._renderReportHeader();
      assert.ok(header.querySelector('.lh-scores-container'), 'contains score container');
    });

    it('renders score gauges in this order: default, pwa, plugins', () => {
      const sampleResultsCopy = JSON.parse(JSON.stringify(sampleResults));
      sampleResultsCopy.categories['lighthouse-plugin-someplugin'] = {
        id: 'lighthouse-plugin-someplugin',
        title: 'Some Plugin',
        auditRefs: [],
      };

      const container = renderer._dom.document().body;
      const output = renderer.renderReport(sampleResultsCopy, container);

      function isPWAGauge(el) {
        return el.querySelector('.lh-gauge__label').textContent === 'PWA';
      }
      function isPluginGauge(el) {
        return el.querySelector('.lh-gauge__label').textContent === 'Some Plugin';
      }

      const indexOfPwaGauge = Array.from(output
        .querySelectorAll('.lh-scores-header > a[class*="lh-gauge"]')).findIndex(isPWAGauge);

      const indexOfPluginGauge = Array.from(output
        .querySelectorAll('.lh-scores-header > a[class*="lh-gauge"]')).findIndex(isPluginGauge);

      const scoresHeaderElem = output.querySelector('.lh-scores-header');
      assert.equal(scoresHeaderElem.children.length - 2, indexOfPwaGauge);
      assert.equal(scoresHeaderElem.children.length - 1, indexOfPluginGauge);
      assert(indexOfPluginGauge > indexOfPwaGauge);

      for (let i = 0; i < scoresHeaderElem.children.length; i++) {
        const gauge = scoresHeaderElem.children[i];

        assert.ok(gauge.classList.contains('lh-gauge__wrapper'));
        if (i >= indexOfPluginGauge) {
          assert.ok(isPluginGauge(gauge));
        } else if (i >= indexOfPwaGauge) {
          assert.ok(isPWAGauge(gauge));
        }
      }
    });

    it('renders score gauges with custom callback', () => {
      const sampleResultsCopy = JSON.parse(JSON.stringify(sampleResults));

      const opts = {
        onPageAnchorRendered: link => {
          const id = link.hash.substring(1);
          link.hash = `#index=0&anchor=${id}`;
        },
      };
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(sampleResultsCopy, container, opts);
      const anchors = output.querySelectorAll('a.lh-gauge__wrapper, a.lh-fraction__wrapper');
      const hashes = Array.from(anchors).map(anchor => anchor.hash).filter(hash => hash);

      // One set for the sticky header, on set for the gauges at the top.
      assert.deepStrictEqual(hashes, [
        '#index=0&anchor=performance',
        '#index=0&anchor=accessibility',
        '#index=0&anchor=best-practices',
        '#index=0&anchor=seo',
        '#index=0&anchor=pwa',
        '#index=0&anchor=performance',
        '#index=0&anchor=accessibility',
        '#index=0&anchor=best-practices',
        '#index=0&anchor=seo',
        '#index=0&anchor=pwa',
      ]);
    });

    it('renders plugin score gauge', () => {
      const sampleResultsCopy = JSON.parse(JSON.stringify(sampleResults));
      sampleResultsCopy.categories['lighthouse-plugin-someplugin'] = {
        id: 'lighthouse-plugin-someplugin',
        title: 'Some Plugin',
        auditRefs: [],
      };
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(sampleResultsCopy, container);
      const scoresHeaderElem = output.querySelector('.lh-scores-header');

      const gaugeCount = scoresHeaderElem.querySelectorAll('.lh-gauge').length;
      const pluginGaugeCount =
        scoresHeaderElem.querySelectorAll('.lh-gauge__wrapper--plugin').length;

      // 5 core categories + the 1 plugin.
      assert.equal(6, gaugeCount);
      assert.equal(1, pluginGaugeCount);
    });

    it('should not mutate a report object', () => {
      const container = renderer._dom.document().body;
      const originalResults = JSON.parse(JSON.stringify(sampleResults));
      renderer.renderReport(sampleResults, container);
      assert.deepStrictEqual(sampleResults, originalResults);
    }, 2000);

    it('renders no warning section when no lighthouseRunWarnings occur', () => {
      const warningResults = Object.assign({}, sampleResults, {runWarnings: []});
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(warningResults, container);
      assert.strictEqual(output.querySelector('.lh-warnings--toplevel'), null);
    });

    it('renders a warning section', () => {
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(sampleResults, container);

      const warningEls = output.querySelectorAll('.lh-warnings--toplevel > ul > li');
      assert.strictEqual(warningEls.length, sampleResults.runWarnings.length);
    });

    it('renders links in the warning section', () => {
      const warningResults = Object.assign({}, sampleResults, {
        runWarnings: ['[I am a link](https://example.com/)'],
      });
      const container = renderer._dom.document().body;
      const output = renderer.renderReport(warningResults, container);

      const warningEls = output.querySelectorAll('.lh-warnings--toplevel ul li a');
      expect(warningEls).toHaveLength(1);
      expect(warningEls[0].href).toEqual('https://example.com/');
    });

    it('renders a footer', () => {
      const footer = renderer._renderReportFooter(sampleResults);
      const footerContent = footer.querySelector('.lh-footer').textContent;
      assert.ok(/Generated by Lighthouse \d/.test(footerContent), 'includes lh version');
      assert.ok(footerContent.match(TIMESTAMP_REGEX), 'includes timestamp');

      // Check env items were populated.
      const items = Array.from(footer.querySelectorAll('.lh-meta__item'));
      expect(items.length).toBeGreaterThanOrEqual(6);

      const itemsTxt = items.map(el => `${el.textContent} ${el.title}`).join('\n');
      expect(itemsTxt).toContain('Moto G4');
      expect(itemsTxt).toContain('RTT');
      expect(itemsTxt).toMatch(/\dx/);
      expect(itemsTxt).toContain(sampleResults.environment.networkUserAgent);
    });
  });

  it('should add LHR channel to doc link parameters', () => {
    const lhrChannel = sampleResults.configSettings.channel;
    // Make sure we have a channel in the LHR.
    assert.ok(lhrChannel.length > 2);

    const container = renderer._dom.document().body;
    const output = renderer.renderReport(sampleResults, container);

    const DOCS_ORIGINS = ['https://developers.google.com', 'https://web.dev'];
    const utmChannels = [...output.querySelectorAll('a[href*="utm_source=lighthouse"')]
      .map(a => new URL(a.href))
      .filter(url => DOCS_ORIGINS.includes(url.origin))
      .map(url => url.searchParams.get('utm_medium'));

    assert.ok(utmChannels.length > 100);
    for (const utmChannel of utmChannels) {
      assert.strictEqual(utmChannel, lhrChannel);
    }
  });

  it('renders `not_applicable` audits as `notApplicable`', () => {
    const clonedSampleResult = JSON.parse(JSON.stringify(sampleResultsOrig));

    let notApplicableCount = 0;
    Object.values(clonedSampleResult.audits).forEach(audit => {
      // The performance-budget audit is omitted from the DOM when it is not applicable
      if (audit.scoreDisplayMode === 'notApplicable' && audit.id !== 'performance-budget') {
        notApplicableCount++;
        audit.scoreDisplayMode = 'not_applicable';
      }
    });

    assert.ok(notApplicableCount > 20); // Make sure something's being tested.

    const container = renderer._dom.document().body;
    const reportElement = renderer.renderReport(sampleResults, container);
    const notApplicableElementCount = reportElement
      .querySelectorAll('.lh-audit--notapplicable').length;
    assert.strictEqual(notApplicableCount, notApplicableElementCount);
  });
});
