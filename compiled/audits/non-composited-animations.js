/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @fileoverview Audit which reports all animations that failed to composite along
 * with the failure reasons. Failure reasons are only reported if they are actionable.
 * https://docs.google.com/document/d/1XKcJP2CKmNKfOcDsVvliAQ-e1H9C1nf2H-pzTdyafAA/edit?usp=sharing
 */

const Audit = require('./audit.js');
const i18n = require('../lib/i18n/i18n.js');

const UIStrings = {
  /** Title of a diagnostic LH audit that provides details on animations that are not composited. */
  title: 'Avoid non-composited animations',
  /** Description of a diagnostic LH audit that shows the user animations that are not composited. Janky means frames may be skipped and the animation will look bad. Acceptable alternatives here might be 'poor', or 'slow'. */
  description: 'Animations which are not composited can be janky and increase CLS. ' +
    '[Learn more](https://web.dev/non-composited-animations)',
  /** [ICU Syntax] Label identifying the number of animated elements that are not composited. */
  displayValue: `{itemCount, plural,
  =1 {# animated element found}
  other {# animated elements found}
  }`,
  /**
   * @description [ICU Syntax] Descriptive reason for why a user-provided animation failed to be optimized by the browser due to the animated CSS property not being supported on the compositor. Shown in a table with a list of other potential failure reasons.
   * @example {height, width} properties
   */
  unsupportedCSSProperty: `{propertyCount, plural,
    =1 {Unsupported CSS Property: {properties}}
    other {Unsupported CSS Properties: {properties}}
  }`,
  /** Descriptive reason for why a user-provided animation failed to be optimized by the browser due to a `transform` property being dependent on the size of the element itself. Shown in a table with a list of other potential failure reasons.  */
  transformDependsBoxSize: 'Transform-related property depends on box size',
  /** Descriptive reason for why a user-provided animation failed to be optimized by the browser due to a `filter` property possibly moving pixels. Shown in a table with a list of other potential failure reasons.  */
  filterMayMovePixels: 'Filter-related property may move pixels',
  /** Descriptive reason for why a user-provided animation failed to be optimized by the browser due to an effect having a composite mode which is not `replace`. Shown in a table with a list of other potential failure reasons.  */
  nonReplaceCompositeMode: 'Effect has composite mode other than "replace"',
  /** Descriptive reason for why a user-provided animation failed to be optimized by the browser due to another animation on the same target being incompatible. Shown in a table with a list of other potential failure reasons.  */
  incompatibleAnimations: 'Target has another animation which is incompatible',
  /** Descriptive reason for why a user-provided animation failed to be optimized by the browser due to an effect having unsupported timing parameters. Shown in a table with a list of other potential failure reasons.  */
  unsupportedTimingParameters: 'Effect has unsupported timing parameters',
};

const str_ = i18n.createMessageInstanceIdFn(__filename, UIStrings);

/**
 * Each failure reason is represented by a bit flag. The bit shift operator '<<' is used to define which bit corresponds to each failure reason.
 * https://source.chromium.org/search?q=f:compositor_animations.h%20%22enum%20FailureReason%22
 * @type {{flag: number, text: string}[]}
 */
const ACTIONABLE_FAILURE_REASONS = [
  {
    flag: 1 << 13,
    text: UIStrings.unsupportedCSSProperty,
  },
  {
    flag: 1 << 11,
    text: UIStrings.transformDependsBoxSize,
  },
  {
    flag: 1 << 12,
    text: UIStrings.filterMayMovePixels,
  },
  {
    flag: 1 << 4,
    text: UIStrings.nonReplaceCompositeMode,
  },
  {
    flag: 1 << 6,
    text: UIStrings.incompatibleAnimations,
  },
  {
    flag: 1 << 3,
    text: UIStrings.unsupportedTimingParameters,
  },
];

/**
 * Return list of actionable failure reasons and a boolean if some reasons are not actionable.
 * Each flag is a number with a single bit set to 1 in the position corresponding to a failure reason.
 * We can check if a specific bit is true in the failure coding using bitwise and '&' with the flag.
 * @param {number} failureCode
 * @param {string[]} unsupportedProperties
 * @return {LH.IcuMessage[]}
 */
function getActionableFailureReasons(failureCode, unsupportedProperties) {
  return ACTIONABLE_FAILURE_REASONS
    .filter(reason => failureCode & reason.flag)
    .map(reason => {
      if (reason.text === UIStrings.unsupportedCSSProperty) {
        return str_(reason.text, {
          propertyCount: unsupportedProperties.length,
          properties: unsupportedProperties.join(', '),
        });
      }
      return str_(reason.text);
    });
}

class NonCompositedAnimations extends Audit {
  /**
   * @return {LH.Audit.Meta}
   */
  static get meta() {
    return {
      id: 'non-composited-animations',
      scoreDisplayMode: Audit.SCORING_MODES.INFORMATIVE,
      title: str_(UIStrings.title),
      description: str_(UIStrings.description),
      requiredArtifacts: ['TraceElements', 'HostUserAgent'],
    };
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {Promise<LH.Audit.Product>}
   */
  static async audit(artifacts) {
    // COMPAT: This audit requires m86
    const match = artifacts.HostUserAgent.match(/Chrome\/(\d+)/);
    if (!match || Number(match[1]) < 86) {
      return {
        score: 1,
        notApplicable: true,
      };
    }

    /** @type {LH.Audit.Details.TableItem[]} */
    const results = [];
    let shouldAddAnimationNameColumn = false;
    artifacts.TraceElements.forEach(element => {
      if (element.traceEventType !== 'animation') return;

      const animations = element.animations || [];
      const animationReasons = new Map();
      for (const {name, failureReasonsMask, unsupportedProperties} of animations) {
        if (!failureReasonsMask) continue;
        const failureReasons =
          getActionableFailureReasons(failureReasonsMask, unsupportedProperties || []);
        for (const failureReason of failureReasons) {
          if (name) {
            shouldAddAnimationNameColumn = true;
          }
          const reasons = animationReasons.get(name) || new Set();
          reasons.add(failureReason);
          animationReasons.set(name, reasons);
        }
      }
      if (!animationReasons.size) return;

      const allFailureReasons = [];
      for (const [name, reasons] of animationReasons) {
        for (const failureReason of reasons) {
          allFailureReasons.push({
            failureReason,
            animation: name,
          });
        }
      }

      results.push({
        node: Audit.makeNodeItem(element.node),
        subItems: {
          type: 'subitems',
          items: allFailureReasons,
        },
      });
    });

    /** @type {LH.Audit.Details.Table['headings']} */
    const headings = [
      /* eslint-disable max-len */
      {key: 'node', itemType: 'node', subItemsHeading: {key: 'failureReason', itemType: 'text'}, text: str_(i18n.UIStrings.columnElement)},
      /* eslint-enable max-len */
    ];

    if (shouldAddAnimationNameColumn) {
      headings.push(
        /* eslint-disable max-len */
        {key: null, itemType: 'text', subItemsHeading: {key: 'animation', itemType: 'text'}, text: str_(i18n.UIStrings.columnName)}
        /* eslint-enable max-len */
      );
    }

    const details = Audit.makeTableDetails(headings, results);

    let displayValue;
    if (results.length > 0) {
      displayValue = str_(UIStrings.displayValue, {itemCount: results.length});
    }

    return {
      score: results.length === 0 ? 1 : 0,
      notApplicable: results.length === 0,
      details,
      displayValue,
    };
  }
}

module.exports = NonCompositedAnimations;
module.exports.UIStrings = UIStrings;
