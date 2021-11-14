/**
 * @license
 * Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * @fileoverview Adds tools button, print, and other dynamic functionality to
 * the report.
 */

/** @typedef {import('./dom').DOM} DOM */

import {ElementScreenshotRenderer} from './element-screenshot-renderer.js';
import {toggleDarkTheme} from './features-util.js';
import {openTreemap} from './open-tab.js';
import {TopbarFeatures} from './topbar-features.js';
import {Util} from './util.js';
import {getFilenamePrefix} from '../generator/file-namer.js';

/**
 * @param {HTMLTableElement} tableEl
 * @return {Array<HTMLElement>}
 */
function getTableRows(tableEl) {
  return Array.from(tableEl.tBodies[0].rows);
}
export class ReportUIFeatures {
  /**
   * @param {DOM} dom
   */
  constructor(dom) {
    /** @type {LH.Result} */
    this.json; // eslint-disable-line no-unused-expressions
    /** @type {DOM} */
    this._dom = dom;
    /** @type {Document} */
    this._document = this._dom.document();
    this._topbar = new TopbarFeatures(this, dom);

    this.onMediaQueryChange = this.onMediaQueryChange.bind(this);
  }

  /**
   * Adds tools button, print, and other functionality to the report. The method
   * should be called whenever the report needs to be re-rendered.
   * @param {LH.Result} lhr
   */
  initFeatures(lhr) {
    this.json = lhr;

    this._topbar.enable(lhr);
    this._topbar.resetUIState();
    this._setupMediaQueryListeners();
    this._setupThirdPartyFilter();
    this._setupElementScreenshotOverlay(this._dom.find('.lh-container', this._document));

    let turnOffTheLights = false;
    // Do not query the system preferences for DevTools - DevTools should only apply dark theme
    // if dark is selected in the settings panel.
    if (!this._dom.isDevTools() && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      turnOffTheLights = true;
    }

    // Fireworks!
    // To get fireworks you need 100 scores in all core categories, except PWA (because going the PWA route is discretionary).
    const fireworksRequiredCategoryIds = ['performance', 'accessibility', 'best-practices', 'seo'];
    const scoresAll100 = fireworksRequiredCategoryIds.every(id => {
      const cat = lhr.categories[id];
      return cat && cat.score === 1;
    });
    if (scoresAll100) {
      turnOffTheLights = true;
      this._enableFireworks();
    }

    if (turnOffTheLights) {
      toggleDarkTheme(this._dom, true);
    }

    // Show the metric descriptions by default when there is an error.
    const hasMetricError = lhr.categories.performance && lhr.categories.performance.auditRefs
      .some(audit => Boolean(audit.group === 'metrics' && lhr.audits[audit.id].errorMessage));
    if (hasMetricError) {
      const toggleInputEl = this._dom.find('input.lh-metrics-toggle__input', this._document);
      toggleInputEl.checked = true;
    }

    const showTreemapApp =
      this.json.audits['script-treemap-data'] && this.json.audits['script-treemap-data'].details;
    if (showTreemapApp) {
      this.addButton({
        text: Util.i18n.strings.viewTreemapLabel,
        icon: 'treemap',
        onClick: () => openTreemap(this.json),
      });
    }

    // Fill in all i18n data.
    for (const node of this._dom.findAll('[data-i18n]', this._dom.document())) {
      // These strings are guaranteed to (at least) have a default English string in Util.UIStrings,
      // so this cannot be undefined as long as `report-ui-features.data-i18n` test passes.
      const i18nKey = node.getAttribute('data-i18n');
      const i18nAttr = /** @type {keyof typeof Util.i18n.strings} */ (i18nKey);
      node.textContent = Util.i18n.strings[i18nAttr];
    }
  }

  /**
   * @param {{container?: Element, text: string, icon?: string, onClick: () => void}} opts
   */
  addButton(opts) {
    // report-ui-features doesn't have a reference to the root report el, and PSI has
    // 2 reports on the page (and not even attached to DOM when installFeatures is called..)
    // so we need a container option to specify where the element should go.
    const metricsEl = this._document.querySelector('.lh-audit-group--metrics');
    const containerEl = opts.container || metricsEl;
    if (!containerEl) return;

    let buttonsEl = containerEl.querySelector('.lh-buttons');
    if (!buttonsEl) buttonsEl = this._dom.createChildOf(containerEl, 'div', 'lh-buttons');

    const classes = [
      'lh-button',
    ];
    if (opts.icon) {
      classes.push('lh-report-icon');
      classes.push(`lh-report-icon--${opts.icon}`);
    }
    const buttonEl = this._dom.createChildOf(buttonsEl, 'button', classes.join(' '));
    buttonEl.textContent = opts.text;
    buttonEl.addEventListener('click', opts.onClick);
    return buttonEl;
  }

  /**
   * Returns the html that recreates this report.
   * @return {string}
   */
  getReportHtml() {
    this._topbar.resetUIState();
    return this._document.documentElement.outerHTML;
  }

  /**
   * Save json as a gist. Unimplemented in base UI features.
   */
  saveAsGist() {
    // TODO ?
    throw new Error('Cannot save as gist from base report');
  }

  _enableFireworks() {
    const scoresContainer = this._dom.find('.lh-scores-container', this._document);
    scoresContainer.classList.add('lh-score100');
    scoresContainer.addEventListener('click', _ => {
      scoresContainer.classList.toggle('lh-fireworks-paused');
    });
  }

  _setupMediaQueryListeners() {
    const mediaQuery = self.matchMedia('(max-width: 500px)');
    mediaQuery.addListener(this.onMediaQueryChange);
    // Ensure the handler is called on init
    this.onMediaQueryChange(mediaQuery);
  }

  /**
   * Resets the state of page before capturing the page for export.
   * When the user opens the exported HTML page, certain UI elements should
   * be in their closed state (not opened) and the templates should be unstamped.
   */
  _resetUIState() {
    this._topbar.resetUIState();
  }

  /**
   * Handle media query change events.
   * @param {MediaQueryList|MediaQueryListEvent} mql
   */
  onMediaQueryChange(mql) {
    const root = this._dom.find('.lh-root', this._document);
    root.classList.toggle('lh-narrow', mql.matches);
  }

  _setupThirdPartyFilter() {
    // Some audits should not display the third party filter option.
    const thirdPartyFilterAuditExclusions = [
      // These audits deal explicitly with third party resources.
      'uses-rel-preconnect',
      'third-party-facades',
    ];
    // Some audits should hide third party by default.
    const thirdPartyFilterAuditHideByDefault = [
      // Only first party resources are actionable.
      'legacy-javascript',
    ];

    // Get all tables with a text url column.
    const tables = Array.from(this._document.querySelectorAll('table.lh-table'));
    const tablesWithUrls = tables
      .filter(el =>
        el.querySelector('td.lh-table-column--url, td.lh-table-column--source-location'))
      .filter(el => {
        const containingAudit = el.closest('.lh-audit');
        if (!containingAudit) throw new Error('.lh-table not within audit');
        return !thirdPartyFilterAuditExclusions.includes(containingAudit.id);
      });

    tablesWithUrls.forEach((tableEl) => {
      const rowEls = getTableRows(tableEl);
      const thirdPartyRows = this._getThirdPartyRows(rowEls, this.json.finalUrl);

      // create input box
      const filterTemplate = this._dom.createComponent('3pFilter');
      const filterInput = this._dom.find('input', filterTemplate);

      filterInput.addEventListener('change', e => {
        const shouldHideThirdParty = e.target instanceof HTMLInputElement && !e.target.checked;
        let even = true;
        let rowEl = rowEls[0];
        while (rowEl) {
          const shouldHide = shouldHideThirdParty && thirdPartyRows.includes(rowEl);

          // Iterate subsequent associated sub item rows.
          do {
            rowEl.classList.toggle('lh-row--hidden', shouldHide);
            // Adjust for zebra styling.
            rowEl.classList.toggle('lh-row--even', !shouldHide && even);
            rowEl.classList.toggle('lh-row--odd', !shouldHide && !even);

            rowEl = /** @type {HTMLElement} */ (rowEl.nextElementSibling);
          } while (rowEl && rowEl.classList.contains('lh-sub-item-row'));

          if (!shouldHide) even = !even;
        }
      });

      this._dom.find('.lh-3p-filter-count', filterTemplate).textContent =
          `${thirdPartyRows.length}`;
      this._dom.find('.lh-3p-ui-string', filterTemplate).textContent =
          Util.i18n.strings.thirdPartyResourcesLabel;

      const allThirdParty = thirdPartyRows.length === rowEls.length;
      const allFirstParty = !thirdPartyRows.length;

      // If all or none of the rows are 3rd party, disable the checkbox.
      if (allThirdParty || allFirstParty) {
        filterInput.disabled = true;
        filterInput.checked = allThirdParty;
      }

      // Add checkbox to the DOM.
      if (!tableEl.parentNode) return; // Keep tsc happy.
      tableEl.parentNode.insertBefore(filterTemplate, tableEl);

      // Hide third-party rows for some audits by default.
      const containingAudit = tableEl.closest('.lh-audit');
      if (!containingAudit) throw new Error('.lh-table not within audit');
      if (thirdPartyFilterAuditHideByDefault.includes(containingAudit.id) && !allThirdParty) {
        filterInput.click();
      }
    });
  }

  /**
   * @param {Element} el
   */
  _setupElementScreenshotOverlay(el) {
    const fullPageScreenshot =
      this.json.audits['full-page-screenshot'] &&
      this.json.audits['full-page-screenshot'].details &&
      this.json.audits['full-page-screenshot'].details.type === 'full-page-screenshot' &&
      this.json.audits['full-page-screenshot'].details;
    if (!fullPageScreenshot) return;

    ElementScreenshotRenderer.installOverlayFeature({
      dom: this._dom,
      reportEl: el,
      overlayContainerEl: el,
      fullPageScreenshot,
    });
  }

  /**
   * From a table with URL entries, finds the rows containing third-party URLs
   * and returns them.
   * @param {HTMLElement[]} rowEls
   * @param {string} finalUrl
   * @return {Array<HTMLElement>}
   */
  _getThirdPartyRows(rowEls, finalUrl) {
    /** @type {Array<HTMLElement>} */
    const thirdPartyRows = [];
    const finalUrlRootDomain = Util.getRootDomain(finalUrl);

    for (const rowEl of rowEls) {
      if (rowEl.classList.contains('lh-sub-item-row')) continue;

      const urlItem = rowEl.querySelector('div.lh-text__url');
      if (!urlItem) continue;

      const datasetUrl = urlItem.dataset.url;
      if (!datasetUrl) continue;
      const isThirdParty = Util.getRootDomain(datasetUrl) !== finalUrlRootDomain;
      if (!isThirdParty) continue;

      thirdPartyRows.push(rowEl);
    }

    return thirdPartyRows;
  }

  /**
   * Downloads a file (blob) using a[download].
   * @param {Blob|File} blob The file to save.
   */
  _saveFile(blob) {
    const filename = getFilenamePrefix({
      finalUrl: this.json.finalUrl,
      fetchTime: this.json.fetchTime,
    });

    const ext = blob.type.match('json') ? '.json' : '.html';

    const a = this._dom.createElement('a');
    a.download = `${filename}${ext}`;
    this._dom.safelySetBlobHref(a, blob);
    this._document.body.appendChild(a); // Firefox requires anchor to be in the DOM.
    a.click();

    // cleanup.
    this._document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }
}
