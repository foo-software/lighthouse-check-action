/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/** @typedef {Omit<LH.TraceEvent, 'name'|'args'> & {name: 'LayoutShift', args: {data: {score: number, weighted_score_delta: number, had_recent_input: boolean}}}} LayoutShiftEvent */

const makeComputedArtifact = require('../computed-artifact.js');
const TraceOfTab = require('../trace-of-tab.js');
const log = require('lighthouse-logger');
const LayoutShiftVariants = require('../layout-shift-variants.js');

class CumulativeLayoutShiftAllFrames {
  /**
   * @param {LH.Trace} trace
   * @param {LH.Audit.Context} context
   * @return {Promise<{value: number}>}
   */
  static async compute_(trace, context) {
    const traceOfTab = await TraceOfTab.request(trace, context);
    const layoutShiftEvents = LayoutShiftVariants.getLayoutShiftEvents(traceOfTab.frameTreeEvents);

    let traceHasWeightedScore = true;
    const cumulativeShift = layoutShiftEvents
      .map(e => {
        // COMPAT: remove after m90 hits stable
        // We should replace with a LHError at that point:
        // https://github.com/GoogleChrome/lighthouse/pull/12034#discussion_r568150032
        if (e.weightedScoreDelta === undefined) {
          traceHasWeightedScore = false;
          return e.score;
        }

        return e.weightedScoreDelta;
      })
      .reduce((sum, score) => sum + score, 0);

    if (traceHasWeightedScore) {
      log.warn(
        'CLS-AF',
        'Trace does not have weighted layout shift scores. CLS-AF may not be accurate.'
      );
    }

    return {
      value: cumulativeShift,
    };
  }
}

module.exports = makeComputedArtifact(CumulativeLayoutShiftAllFrames);
