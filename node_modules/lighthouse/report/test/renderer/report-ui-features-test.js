/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import {strict as assert} from 'assert';

import jsdom from 'jsdom';

import reportAssets from '../../generator/report-assets.js';
import {Util} from '../../renderer/util.js';
import {DOM} from '../../renderer/dom.js';
import {DetailsRenderer} from '../../renderer/details-renderer.js';
import {ReportUIFeatures} from '../../renderer/report-ui-features.js';
import {CategoryRenderer} from '../../renderer/category-renderer.js';
import {ReportRenderer} from '../../renderer/report-renderer.js';
import sampleResultsOrig from '../../../lighthouse-core/test/results/sample_v2.json';

describe('ReportUIFeatures', () => {
  let sampleResults;
  let dom;

  /**
   * @param {LH.JSON} lhr
   * @return {HTMLElement}
   */
  function render(lhr) {
    const detailsRenderer = new DetailsRenderer(dom);
    const categoryRenderer = new CategoryRenderer(dom, detailsRenderer);
    const renderer = new ReportRenderer(dom, categoryRenderer);
    const reportUIFeatures = new ReportUIFeatures(dom);
    const container = dom.find('main', dom._document);
    renderer.renderReport(lhr, container);
    reportUIFeatures.initFeatures(lhr);
    return container;
  }

  beforeAll(() => {
    // Stub out matchMedia for Node.
    global.matchMedia = function() {
      return {
        addListener: function() {},
      };
    };

    const document = new jsdom.JSDOM(reportAssets.REPORT_TEMPLATE);
    global.self = document.window;
    global.self.matchMedia = function() {
      return {
        addListener: function() {},
      };
    };

    global.HTMLElement = document.window.HTMLElement;
    global.HTMLInputElement = document.window.HTMLInputElement;

    global.window = document.window;
    global.window.getComputedStyle = function() {
      return {
        marginTop: '10px',
        height: '10px',
      };
    };

    dom = new DOM(document.window.document);
    sampleResults = Util.prepareReportResult(sampleResultsOrig);
    render(sampleResults);
  });

  afterAll(() => {
    global.window = undefined;
    global.HTMLElement = undefined;
    global.HTMLInputElement = undefined;
  });

  describe('initFeatures', () => {
    it('should init a report', () => {
      const container = render(sampleResults);
      assert.equal(dom.findAll('.lh-category', container).length, 5);
    });

    it('should init a report with a single category', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      lhr.categories = {
        performance: lhr.categories.performance,
      };
      const container = render(lhr);
      assert.equal(dom.findAll('.lh-category', container).length, 1);
    });

    describe('third-party filtering', () => {
      let container;

      beforeAll(() => {
        const lhr = JSON.parse(JSON.stringify(sampleResults));
        lhr.requestedUrl = lhr.finalUrl = 'http://www.example.com';
        const webpAuditItemTemplate = {
          ...sampleResults.audits['modern-image-formats'].details.items[0],
          wastedBytes: 8.8 * 1024,
        };
        const renderBlockingAuditItemTemplate =
          sampleResults.audits['render-blocking-resources'].details.items[0];
        const textCompressionAuditItemTemplate =
          sampleResults.audits['uses-text-compression'].details.items[0];

        // Interleave first/third party URLs to test restoring order.
        lhr.audits['modern-image-formats'].details.items = [
          {
            ...webpAuditItemTemplate,
            url: 'http://www.cdn.com/img1.jpg', // Third party, will be filtered.
          },
          {
            ...webpAuditItemTemplate,
            url: 'http://www.example.com/img2.jpg', // First party, not filtered.
          },
          {
            ...webpAuditItemTemplate,
            url: 'http://www.notexample.com/img3.jpg', // Third party, will be filtered.
          },
        ];

        // Test sub-item rows.
        lhr.audits['unused-javascript'].details.items = [
          {
            ...webpAuditItemTemplate,
            url: 'http://www.cdn.com/script1.js', // Third party, will be filtered.
            subItems: {
              type: 'subitems',
              items: [
                {source: '1', sourceBytes: 1, sourceWastedBytes: 1},
                {source: '2', sourceBytes: 2, sourceWastedBytes: 2},
              ],
            },
          },
          {
            ...webpAuditItemTemplate,
            url: 'http://www.example.com/script2.js', // First party, not filtered.
            subItems: {
              type: 'subitems',
              items: [
                {source: '3', sourceBytes: 3, sourceWastedBytes: 3},
                {source: '4', sourceBytes: 4, sourceWastedBytes: 4},
              ],
            },
          },
          {
            ...webpAuditItemTemplate,
            url: 'http://www.notexample.com/script3.js', // Third party, will be filtered.
            subItems: {
              type: 'subitems',
              items: [
                {source: '5', sourceBytes: 5, sourceWastedBytes: 5},
                {source: '6', sourceBytes: 6, sourceWastedBytes: 6},
              ],
            },
          },
        ];

        // Only third party URLs to test that checkbox is hidden
        lhr.audits['render-blocking-resources'].details.items = [
          {
            ...renderBlockingAuditItemTemplate,
            url: 'http://www.cdn.com/script1.js', // Third party.
          },
          {
            ...renderBlockingAuditItemTemplate,
            url: 'http://www.google.com/script2.js', // Third party.
          },
          {
            ...renderBlockingAuditItemTemplate,
            url: 'http://www.notexample.com/script3.js', // Third party.
          },
        ];

        // Only first party URLs to test that checkbox is hidden
        lhr.audits['uses-text-compression'].details.items = [
          {
            ...textCompressionAuditItemTemplate,
            url: 'http://www.example.com/font1.ttf', // First party.
          },
          {
            ...textCompressionAuditItemTemplate,
            url: 'http://www.example.com/font2.ttf', // First party.
          },
          {
            ...textCompressionAuditItemTemplate,
            url: 'http://www.example.com/font3.ttf', // First party.
          },
        ];

        // render a report onto the UIFeature dom
        container = render(lhr);
      });

      it('filters out third party resources in on click', () => {
        const filterCheckbox = dom.find('#modern-image-formats .lh-3p-filter-input', container);

        function getUrlsInTable() {
          return dom
            .findAll('#modern-image-formats tr:not(.lh-row--hidden) .lh-text__url a:first-child', container) // eslint-disable-line max-len
            .map(el => el.textContent);
        }

        expect(getUrlsInTable()).toEqual(['/img1.jpg', '/img2.jpg', '/img3.jpg']);
        filterCheckbox.click();
        expect(getUrlsInTable()).toEqual(['/img2.jpg']);
        filterCheckbox.click();
        expect(getUrlsInTable()).toEqual(['/img1.jpg', '/img2.jpg', '/img3.jpg']);
      });

      it('filters out sub-item rows of third party resources on click', () => {
        dom.find('#unused-javascript', container);
        const filterCheckbox = dom.find('#unused-javascript .lh-3p-filter-input', container);

        function getRowIdentifiers() {
          return dom
            .findAll(
              '#unused-javascript tbody tr:not(.lh-row--hidden)', container)
            .map(el => el.textContent);
        }

        const initialExpected = [
          '/script1.js(www.cdn.com)24.0 KiB8.8 KiB',
          '10.0 KiB0.0 KiB',
          '20.0 KiB0.0 KiB',
          '/script2.js(www.example.com)24.0 KiB8.8 KiB',
          '30.0 KiB0.0 KiB',
          '40.0 KiB0.0 KiB',
          '/script3.js(www.notexample.com)24.0 KiB8.8 KiB',
          '50.0 KiB0.0 KiB',
          '60.0 KiB0.0 KiB',
        ];

        expect(getRowIdentifiers()).toEqual(initialExpected);
        filterCheckbox.click();
        expect(getRowIdentifiers()).toEqual([
          '/script2.js(www.example.com)24.0 KiB8.8 KiB',
          '30.0 KiB0.0 KiB',
          '40.0 KiB0.0 KiB',
        ]);
        filterCheckbox.click();
        expect(getRowIdentifiers()).toEqual(initialExpected);
      });

      it('adds no filter for audits in thirdPartyFilterAuditExclusions', () => {
        const checkboxClassName = 'lh-3p-filter-input';

        const yesCheckbox = dom.find(`#modern-image-formats .${checkboxClassName}`, container);
        expect(yesCheckbox).toBeTruthy();

        expect(() => dom.find(`#uses-rel-preconnect .${checkboxClassName}`, container))
          .toThrowError('query #uses-rel-preconnect .lh-3p-filter-input not found');
      });

      it('filter is disabled and checked for when just third party resources', () => {
        const filterCheckbox =
          dom.find('#render-blocking-resources .lh-3p-filter-input', container);
        expect(filterCheckbox.disabled).toEqual(true);
        expect(filterCheckbox.checked).toEqual(true);
      });

      it('filter is disabled and not checked for just first party resources', () => {
        const filterCheckbox = dom.find('#uses-text-compression .lh-3p-filter-input', container);
        expect(filterCheckbox.disabled).toEqual(true);
        expect(filterCheckbox.checked).toEqual(false);
      });
    });
  });

  describe('fireworks', () => {
    it('should render an non-all 100 report without fireworks', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      lhr.categories.performance.score = 0.5;
      const container = render(lhr);
      assert.ok(container.querySelector('.lh-score100') === null, 'has no fireworks treatment');
    });

    it('should render an all 100 report with fireworks', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      Object.values(lhr.categories).forEach(element => {
        element.score = 1;
      });
      const container = render(lhr);
      assert.ok(container.querySelector('.lh-score100'), 'has fireworks treatment');
    });

    it('should show fireworks for all 100s except PWA', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      Object.values(lhr.categories).forEach(element => {
        element.score = 1;
      });
      lhr.categories.pwa.score = 0;

      const container = render(lhr);
      assert.ok(container.querySelector('.lh-score100'), 'has fireworks treatment');
    });

    it('should not render fireworks if all core categories are not present', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      delete lhr.categories.performance;
      delete lhr.categoryGroups.performace;
      Object.values(lhr.categories).forEach(element => {
        element.score = 1;
      });
      const container = render(lhr);
      assert.ok(container.querySelector('.lh-score100') === null, 'has no fireworks treatment');
    });
  });

  describe('metric descriptions', () => {
    it('with no errors, hide by default', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      const container = render(lhr);
      assert.ok(!container.querySelector('.lh-metrics-toggle__input').checked);
    });

    it('with error, show by default', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));
      lhr.audits['first-contentful-paint'].errorMessage = 'Error.';
      const container = render(lhr);
      assert.ok(container.querySelector('.lh-metrics-toggle__input').checked);
    });
  });

  describe('tools button', () => {
    let window;
    let dropDown;

    beforeEach(() => {
      window = dom.document().defaultView;
      const features = new ReportUIFeatures(dom);
      features.initFeatures(sampleResults);
      dropDown = features._topbar._dropDownMenu;
    });

    it('click should toggle active class', () => {
      dropDown._toggleEl.click();
      assert.ok(dropDown._toggleEl.classList.contains('lh-active'));

      dropDown._toggleEl.click();
      assert.ok(!dropDown._toggleEl.classList.contains('lh-active'));
    });


    it('Escape key removes active class', () => {
      dropDown._toggleEl.click();
      assert.ok(dropDown._toggleEl.classList.contains('lh-active'));

      const escape = new window.KeyboardEvent('keydown', {keyCode: /* ESC */ 27});
      dom.document().dispatchEvent(escape);
      assert.ok(!dropDown._toggleEl.classList.contains('lh-active'));
    });

    ['ArrowUp', 'ArrowDown', 'Enter', ' '].forEach((code) => {
      it(`'${code}' adds active class`, () => {
        const event = new window.KeyboardEvent('keydown', {code});
        dropDown._toggleEl.dispatchEvent(event);
        assert.ok(dropDown._toggleEl.classList.contains('lh-active'));
      });
    });

    it('ArrowUp on the first menu element should focus the last element', () => {
      dropDown._toggleEl.click();

      const arrowUp = new window.KeyboardEvent('keydown', {bubbles: true, code: 'ArrowUp'});
      dropDown._menuEl.firstElementChild.dispatchEvent(arrowUp);

      assert.strictEqual(dom.document().activeElement, dropDown._menuEl.lastElementChild);
    });

    it('ArrowDown on the first menu element should focus the second element', () => {
      dropDown._toggleEl.click();

      const {nextElementSibling} = dropDown._menuEl.firstElementChild;
      const arrowDown = new window.KeyboardEvent('keydown', {bubbles: true, code: 'ArrowDown'});
      dropDown._menuEl.firstElementChild.dispatchEvent(arrowDown);

      assert.strictEqual(dom.document().activeElement, nextElementSibling);
    });

    it('Home on the last menu element should focus the first element', () => {
      dropDown._toggleEl.click();

      const {firstElementChild} = dropDown._menuEl;
      const home = new window.KeyboardEvent('keydown', {bubbles: true, code: 'Home'});
      dropDown._menuEl.lastElementChild.dispatchEvent(home);

      assert.strictEqual(dom.document().activeElement, firstElementChild);
    });

    it('End on the first menu element should focus the last element', () => {
      dropDown._toggleEl.click();

      const {lastElementChild} = dropDown._menuEl;
      const end = new window.KeyboardEvent('keydown', {bubbles: true, code: 'End'});
      dropDown._menuEl.firstElementChild.dispatchEvent(end);

      assert.strictEqual(dom.document().activeElement, lastElementChild);
    });

    describe('_getNextSelectableNode', () => {
      let createDiv;

      beforeAll(() => {
        createDiv = () => dom.document().createElement('div');
      });

      it('should return undefined when nodes is empty', () => {
        const nodes = [];

        const nextNode = dropDown._getNextSelectableNode(nodes);

        assert.strictEqual(nextNode, undefined);
      });

      it('should return the only node when start is defined', () => {
        const node = createDiv();

        const nextNode = dropDown._getNextSelectableNode([node], node);

        assert.strictEqual(nextNode, node);
      });

      it('should return first node when start is undefined', () => {
        const nodes = [createDiv(), createDiv()];

        const nextNode = dropDown._getNextSelectableNode(nodes);

        assert.strictEqual(nextNode, nodes[0]);
      });

      it('should return second node when start is first node', () => {
        const nodes = [createDiv(), createDiv()];

        const nextNode = dropDown._getNextSelectableNode(nodes, nodes[0]);

        assert.strictEqual(nextNode, nodes[1]);
      });

      it('should return first node when start is second node', () => {
        const nodes = [createDiv(), createDiv()];

        const nextNode = dropDown._getNextSelectableNode(nodes, nodes[1]);

        assert.strictEqual(nextNode, nodes[0]);
      });

      it('should skip the undefined node', () => {
        const nodes = [createDiv(), undefined, createDiv()];

        const nextNode = dropDown._getNextSelectableNode(nodes, nodes[0]);

        assert.strictEqual(nextNode, nodes[2]);
      });

      it('should skip the disabled node', () => {
        const disabledNode = createDiv();
        disabledNode.setAttribute('disabled', true);
        const nodes = [createDiv(), disabledNode, createDiv()];

        const nextNode = dropDown._getNextSelectableNode(nodes, nodes[0]);

        assert.strictEqual(nextNode, nodes[2]);
      });
    });

    describe('onMenuFocusOut', () => {
      beforeEach(() => {
        dropDown._toggleEl.click();
        assert.ok(dropDown._toggleEl.classList.contains('lh-active'));
      });

      it('should toggle active class when focus relatedTarget is null', () => {
        const event = new window.FocusEvent('focusout', {relatedTarget: null});
        dropDown.onMenuFocusOut(event);

        assert.ok(!dropDown._toggleEl.classList.contains('lh-active'));
      });

      it('should toggle active class when focus relatedTarget is document.body', () => {
        const relatedTarget = dom.document().body;
        const event = new window.FocusEvent('focusout', {relatedTarget});
        dropDown.onMenuFocusOut(event);

        assert.ok(!dropDown._toggleEl.classList.contains('lh-active'));
      });

      it('should toggle active class when focus relatedTarget is _toggleEl', () => {
        const relatedTarget = dropDown._toggleEl;
        const event = new window.FocusEvent('focusout', {relatedTarget});
        dropDown.onMenuFocusOut(event);

        assert.ok(!dropDown._toggleEl.classList.contains('lh-active'));
      });

      it('should not toggle active class when focus relatedTarget is a menu item', () => {
        const relatedTarget = dropDown._getNextMenuItem();
        const event = new window.FocusEvent('focusout', {relatedTarget});
        dropDown.onMenuFocusOut(event);

        assert.ok(dropDown._toggleEl.classList.contains('lh-active'));
      });
    });
  });

  describe('treemap button', () => {
    it('should only show button if treemap data is available', () => {
      const lhr = JSON.parse(JSON.stringify(sampleResults));

      expect(lhr.audits['script-treemap-data']).not.toBeUndefined();
      expect(render(lhr).querySelector('.lh-button.lh-report-icon--treemap')).toBeTruthy();

      delete lhr.audits['script-treemap-data'];
      expect(render(lhr).querySelector('.lh-button.lh-report-icon--treemap')).toBeNull();
    });
  });

  describe('data-i18n', () => {
    it('should have only valid data-i18n values in template', () => {
      const container = render(sampleResults);
      for (const node of dom.findAll('[data-i18n]', container)) {
        const val = node.getAttribute('data-i18n');
        assert.ok(val in Util.UIStrings, `Invalid data-i18n value of: "${val}" not found.`);
      }
    });
  });
});
