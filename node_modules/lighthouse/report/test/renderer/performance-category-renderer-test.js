/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import {strict as assert} from 'assert';

import jsdom from 'jsdom';

import {Util} from '../../renderer/util.js';
import {I18n} from '../../renderer/i18n.js';
import URL from '../../../lighthouse-core/lib/url-shim.js';
import {DOM} from '../../renderer/dom.js';
import {DetailsRenderer} from '../../renderer/details-renderer.js';
import {PerformanceCategoryRenderer} from '../../renderer/performance-category-renderer.js';
import sampleResultsOrig from '../../../lighthouse-core/test/results/sample_v2.json';

describe('PerfCategoryRenderer', () => {
  let category;
  let renderer;
  let sampleResults;

  beforeAll(() => {
    Util.i18n = new I18n('en', {...Util.UIStrings});

    const {document} = new jsdom.JSDOM().window;
    const dom = new DOM(document);
    const detailsRenderer = new DetailsRenderer(dom);
    renderer = new PerformanceCategoryRenderer(dom, detailsRenderer);

    // TODO: don't call a LH.ReportResult `sampleResults`, which is typically always LH.Result
    sampleResults = Util.prepareReportResult(sampleResultsOrig);
    category = sampleResults.categories.performance;
  });

  afterAll(() => {
    Util.i18n = undefined;
  });

  it('renders the category header', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const score = categoryDOM.querySelector('.lh-category-header');
    const value = categoryDOM.querySelector('.lh-category-header  .lh-gauge__percentage');
    const title = score.querySelector('.lh-gauge__label');

    assert.deepEqual(score, score.firstElementChild, 'first child is a score');
    const scoreInDom = Number(value.textContent);
    assert.ok(Number.isInteger(scoreInDom) && scoreInDom > 10, 'category score is rounded');
    assert.equal(title.textContent, category.title, 'title is set');
  });

  it('renders the sections', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const sections = categoryDOM.querySelectorAll('.lh-category > .lh-audit-group');
    assert.equal(sections.length, 5);
  });

  it('renders the metrics', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const metricsSection = categoryDOM.querySelectorAll('.lh-category > .lh-audit-group')[0];

    const metricAudits = category.auditRefs.filter(audit => audit.group === 'metrics');
    const timelineElements = metricsSection.querySelectorAll('.lh-metric');
    const nontimelineElements = metricsSection.querySelectorAll('.lh-audit');
    assert.equal(timelineElements.length + nontimelineElements.length, metricAudits.length);
    assert.deepStrictEqual(
      Array.from(timelineElements).map(el => el.id),
      [
        'first-contentful-paint',
        'interactive',
        'speed-index',
        'total-blocking-time',
        'largest-contentful-paint',
        'cumulative-layout-shift',
      ]
    );
  });

  it('does not render metrics section if no metric group audits', () => {
    // Remove metrics from category
    const newCategory = JSON.parse(JSON.stringify(category));
    newCategory.auditRefs = category.auditRefs.filter(audit => audit.group !== 'metrics');

    const categoryDOM = renderer.render(newCategory, sampleResults.categoryGroups);
    const sections = categoryDOM.querySelectorAll('.lh-category > .lh-audit-group');
    const metricSection = categoryDOM.querySelector('.lh-audit-group--metrics');
    assert.ok(!metricSection);
    assert.equal(sections.length, 4);
  });

  it('renders the metrics variance disclaimer as markdown', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const disclaimerEl =
        categoryDOM.querySelector('.lh-category-header__description > .lh-metrics__disclaimer');

    assert.ok(disclaimerEl.textContent.includes('Values are estimated'));
    const disclamerLink = disclaimerEl.querySelector('a');
    assert.ok(disclamerLink, 'disclaimer contains coverted markdown link');
    const disclamerUrl = new URL(disclamerLink.href);
    assert.strictEqual(disclamerUrl.hostname, 'web.dev');
    const calcLink = disclaimerEl.querySelector('a.lh-calclink');
    assert.ok(calcLink, 'disclaimer contains scorecalc link');
    assert.strictEqual(new URL(calcLink.href).hostname, 'googlechrome.github.io');
  });

  it('ignores hidden audits', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);

    const hiddenAudits = category.auditRefs.filter(audit => audit.group === 'hidden');
    const auditElements = [...categoryDOM.querySelectorAll('.lh-audit')];
    const matchingElements = auditElements
      .filter(el => hiddenAudits.some(audit => audit.id === el.id));
    expect(matchingElements).toHaveLength(0);
  });

  it('renders the failing performance opportunities', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);

    const oppAudits = category.auditRefs.filter(audit =>
      audit.result.details &&
      audit.result.details.type === 'opportunity' &&
      !Util.showAsPassed(audit.result));
    const oppElements = [...categoryDOM.querySelectorAll('.lh-audit--load-opportunity')];
    expect(oppElements.map(e => e.id).sort()).toEqual(oppAudits.map(a => a.id).sort());
    expect(oppElements.length).toBeGreaterThan(0);
    expect(oppElements.length).toMatchInlineSnapshot('7');

    const oppElement = oppElements[0];
    const oppSparklineBarElement = oppElement.querySelector('.lh-sparkline__bar');
    const oppSparklineElement = oppElement.querySelector('.lh-load-opportunity__sparkline');
    const oppTitleElement = oppElement.querySelector('.lh-audit__title');
    const oppWastedElement = oppElement.querySelector('.lh-audit__display-text');
    assert.ok(oppTitleElement.textContent, 'did not render title');
    assert.ok(oppSparklineBarElement.style.width, 'did not set sparkline width');
    assert.ok(oppWastedElement.textContent, 'did not render stats');
    assert.ok(oppSparklineElement.title, 'did not set tooltip on sparkline');
  });

  it('renders performance opportunities with an errorMessage', () => {
    const auditWithError = {
      score: 0,
      result: {
        score: null, scoreDisplayMode: 'error', errorMessage: 'Yikes!!', title: 'Bug #2',
        description: '',
        details: {
          overallSavingsMs: 0,
          items: [],
          type: 'opportunity',
        },
      },
    };

    const fakeCategory = Object.assign({}, category, {auditRefs: [auditWithError]});
    const categoryDOM = renderer.render(fakeCategory, sampleResults.categoryGroups);
    const tooltipEl = categoryDOM.querySelector('.lh-audit--load-opportunity .lh-tooltip--error');
    assert.ok(tooltipEl, 'did not render error message');
    assert.ok(/Yikes!!/.test(tooltipEl.textContent));
  });

  it('renders performance opportunities\' explanation', () => {
    const auditWithExplanation = {
      score: 0,
      result: {
        score: 0, scoreDisplayMode: 'numeric',
        numericValue: 100, explanation: 'Yikes!!', title: 'Bug #2', description: '',
        details: {
          overallSavingsMs: 0,
          items: [],
          type: 'opportunity',
        },
      },
    };

    const fakeCategory = Object.assign({}, category, {auditRefs: [auditWithExplanation]});
    const categoryDOM = renderer.render(fakeCategory, sampleResults.categoryGroups);

    const selector = '.lh-audit--load-opportunity .lh-audit-explanation';
    const tooltipEl = categoryDOM.querySelector(selector);
    assert.ok(tooltipEl, 'did not render explanation text');
    assert.ok(/Yikes!!/.test(tooltipEl.textContent));
  });

  it('renders the failing diagnostics', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const diagnosticSection = categoryDOM.querySelector(
        '.lh-category > .lh-audit-group.lh-audit-group--diagnostics');

    const diagnosticAuditIds = category.auditRefs.filter(audit => {
      return !audit.group &&
        !(audit.result.details && audit.result.details.type === 'opportunity') &&
        !Util.showAsPassed(audit.result);
    }).map(audit => audit.id).sort();
    assert.ok(diagnosticAuditIds.length > 0);

    const diagnosticElementIds = [...diagnosticSection.querySelectorAll('.lh-audit')]
      .map(el => el.id).sort();
    assert.deepStrictEqual(diagnosticElementIds, diagnosticAuditIds);
  });

  it('renders the passed audits', () => {
    const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
    const passedSection = categoryDOM.querySelector('.lh-clump--passed');

    const passedAudits = category.auditRefs.filter(audit =>
      !audit.group &&
      Util.showAsPassed(audit.result));
    const passedElements = passedSection.querySelectorAll('.lh-audit');
    assert.equal(passedElements.length, passedAudits.length);
  });

  // Unsupported by perf cat renderer right now.
  it.skip('renders any manual audits', () => {
  });

  describe('getWastedMs', () => {
    it('handles erroring opportunities', () => {
      const auditWithDebug = {
        score: 0,
        result: {
          error: true, score: 0,
          numericValue: 100, explanation: 'Yikes!!', title: 'Bug #2',
          details: {
            overallSavingsMs: 0,
            items: [],
            type: 'opportunity',
          },
        },
      };
      const wastedMs = renderer._getWastedMs(auditWithDebug);
      assert.ok(Number.isFinite(wastedMs), 'Finite number not returned by wastedMs');
    });
  });

  describe('budgets', () => {
    it('renders the group and header', () => {
      const categoryDOM = renderer.render(category, sampleResults.categoryGroups);

      const budgetsGroup = categoryDOM.querySelector('.lh-audit-group.lh-audit-group--budgets');
      assert.ok(budgetsGroup);

      const header = budgetsGroup.querySelector('.lh-audit-group__header');
      assert.ok(header);
    });

    it('renders the performance budget table', () => {
      const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
      const budgetTable = categoryDOM.querySelector('#performance-budget.lh-table');
      assert.ok(budgetTable);

      const lhrBudgetEntries = sampleResults.audits['performance-budget'].details.items;
      const tableRows = budgetTable.querySelectorAll('tbody > tr');
      assert.strictEqual(tableRows.length, lhrBudgetEntries.length);
    });

    it('renders the timing budget table', () => {
      const categoryDOM = renderer.render(category, sampleResults.categoryGroups);
      const budgetTable = categoryDOM.querySelector('#timing-budget.lh-table');
      assert.ok(budgetTable);

      const lhrBudgetEntries = sampleResults.audits['timing-budget'].details.items;
      const tableRows = budgetTable.querySelectorAll('tbody > tr');
      assert.strictEqual(tableRows.length, lhrBudgetEntries.length);
    });

    it('does not render the budgets section when all budget audits are notApplicable', () => {
      const budgetlessCategory = JSON.parse(JSON.stringify(category));
      ['performance-budget', 'timing-budget'].forEach((id) => {
        const budgetRef = budgetlessCategory.auditRefs.find(a => a.id === id);
        budgetRef.result.scoreDisplayMode = 'notApplicable';
        delete budgetRef.result.details;
      });

      const categoryDOM = renderer.render(budgetlessCategory, sampleResults.categoryGroups);
      const budgetsGroup = categoryDOM.querySelector('.lh-audit-group.lh-audit-group--budgets');
      assert.strictEqual(budgetsGroup, null);
    });
  });

  describe('_getScoringCalculatorHref', () => {
    it('creates a working link given some auditRefs', () => {
      const categoryClone = JSON.parse(JSON.stringify(category));

      // CLS of 0 is both valid and falsy. Make sure it doesn't become 'null'
      const cls = categoryClone.auditRefs.find(audit => audit.id === 'cumulative-layout-shift');
      cls.result.numericValue = 0;

      const href = renderer._getScoringCalculatorHref(categoryClone.auditRefs);
      const url = new URL(href);
      expect(url.hash.split('&')).toMatchInlineSnapshot(`
Array [
  "#FCP=6844",
  "TTI=8191",
  "SI=8114",
  "TBT=1221",
  "LCP=6844",
  "CLS=0",
  "FMP=6844",
]
`);
    });

    it('also appends device and version number', () => {
      Util.reportJson = {
        configSettings: {formFactor: 'mobile'},
        lighthouseVersion: '6.0.0',
      };
      const href = renderer._getScoringCalculatorHref(category.auditRefs);
      const url = new URL(href);
      try {
        expect(url.hash.split('&')).toMatchInlineSnapshot(`
Array [
  "#FCP=6844",
  "TTI=8191",
  "SI=8114",
  "TBT=1221",
  "LCP=6844",
  "CLS=0.14",
  "FMP=6844",
  "device=mobile",
  "version=6.0.0",
]
`);
      } finally {
        Util.reportJson = null;
      }
    });

    it('uses null if the metric is missing its value', () => {
      const categoryClone = JSON.parse(JSON.stringify(category));
      const lcp = categoryClone.auditRefs.find(audit => audit.id === 'largest-contentful-paint');
      lcp.result.numericValue = undefined;
      lcp.result.score = null;
      const href = renderer._getScoringCalculatorHref(categoryClone.auditRefs);
      expect(href).toContain('LCP=null');
    });
  });

  // This is done all in CSS, but tested here.
  describe('metric description toggles', () => {
    let container;
    let toggle;
    const metricsSelector = '.lh-audit-group--metrics';
    const toggleSelector = '.lh-metrics-toggle__input';
    const magicSelector =
      '.lh-metrics-toggle__input:checked ~ .lh-metrics-container .lh-metric__description';
    let getDescriptionsAfterCheckedToggle;

    describe('works if there is a performance category', () => {
      beforeAll(() => {
        container = renderer.render(category, sampleResults.categoryGroups);
        const metricsAuditGroup = container.querySelector(metricsSelector);
        toggle = metricsAuditGroup.querySelector(toggleSelector);
        // In the CSS, our magicSelector will flip display from `none` to `block`
        getDescriptionsAfterCheckedToggle = _ => metricsAuditGroup.querySelectorAll(magicSelector);
      });

      it('descriptions hidden by default', () => {
        assert.ok(getDescriptionsAfterCheckedToggle().length === 0);
      });

      it('can toggle description visibility', () => {
        assert.ok(getDescriptionsAfterCheckedToggle().length === 0);
        toggle.click();
        assert.ok(getDescriptionsAfterCheckedToggle().length > 2);
        toggle.click();
        assert.ok(getDescriptionsAfterCheckedToggle().length === 0);
      });
    });
  });
});
