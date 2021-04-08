/**
 * @license Copyright 2016 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* global window, document, getNodeDetails */

const Gatherer = require('./gatherer.js');
const fs = require('fs');
const axeLibSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const pageFunctions = require('../../lib/page-functions.js');

/**
 * This is run in the page, not Lighthouse itself.
 * axe.run returns a promise which fulfills with a results object
 * containing any violations.
 * @return {Promise<LH.Artifacts.Accessibility>}
 */
/* istanbul ignore next */
function runA11yChecks() {
  // @ts-expect-error axe defined by axeLibSource
  return window.axe.run(document, {
    elementRef: true,
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
      'duplicate-id': {enabled: false},
      'table-fake-caption': {enabled: false},
      'td-has-header': {enabled: false},
      'marquee': {enabled: false},
      'area-alt': {enabled: false},
      'aria-dpub-role-fallback': {enabled: false},
      'html-xml-lang-mismatch': {enabled: false},
      'blink': {enabled: false},
      'server-side-image-map': {enabled: false},
      'identical-links-same-purpose': {enabled: false},
      'no-autoplay-audio': {enabled: false},
      'svg-img-alt': {enabled: false},
      'audio-caption': {enabled: false},
    },
    // @ts-expect-error
  }).then(axeResults => {
    // axe just scrolled the page, scroll back to the top of the page so that element positions
    // are relative to the top of the page
    document.documentElement.scrollTop = 0;

    // @ts-expect-error
    const augmentAxeNodes = result => {
      // @ts-expect-error
      result.nodes.forEach(node => {
        // @ts-expect-error - getNodeDetails put into scope via stringification
        Object.assign(node, getNodeDetails(node.element));
        // avoid circular JSON concerns
        node.element = node.any = node.all = node.none = undefined;
      });

      // Ensure errors can be serialized over the protocol
      if (result.error instanceof Error) {
        result.error = {
          name: result.error.name,
          message: result.error.message,
          stack: result.error.stack,
          errorNode: result.error.errorNode,
        };
      }
    };

    // Augment the node objects with outerHTML snippet & custom path string
    axeResults.violations.forEach(augmentAxeNodes);
    axeResults.incomplete.forEach(augmentAxeNodes);

    // We only need violations, and circular references are possible outside of violations
    axeResults = {
      violations: axeResults.violations,
      notApplicable: axeResults.inapplicable,
      incomplete: axeResults.incomplete,
      version: axeResults.testEngine.version,
    };
    return axeResults;
  });
}

class Accessibility extends Gatherer {
  /**
   * @param {LH.Gatherer.FRTransitionalContext} passContext
   * @return {Promise<LH.Artifacts.Accessibility>}
   */
  afterPass(passContext) {
    const driver = passContext.driver;
    const expression = `(function () {
      ${pageFunctions.getNodeDetailsString};
      ${axeLibSource};
      return (${runA11yChecks.toString()}());
    })()`;

    return driver.evaluateAsync(expression, {useIsolation: true}).then(returnedValue => {
      if (!returnedValue) {
        throw new Error('No axe-core results returned');
      }
      if (!Array.isArray(returnedValue.violations)) {
        throw new Error('Unable to parse axe results' + returnedValue);
      }
      return returnedValue;
    });
  }
}

module.exports = Accessibility;
