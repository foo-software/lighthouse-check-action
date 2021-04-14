/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('./computed-artifact.js');
const TraceOfTab = require('./trace-of-tab.js');

/** @typedef {{ts: number, score: number, isMainFrame: boolean, weightedScoreDelta?: number}} LayoutShiftEvent */

/**
 * @fileoverview An implementation of the Layout Shift variants being considered
 * as successors to CLS. This file will be removed when a variant is chosen and
 * promoted to a Core Web Vital.
 * @see https://web.dev/better-layout-shift-metric/
 * @see https://github.com/mmocny/web-vitals/wiki/Snippets-for-LSN-using-PerformanceObserver
 */

class LayoutShiftVariants {
  /**
   * Calculates the average LayoutShift score across clusters of LayoutShift
   * events, where a new cluster is created when there's a gap of more than 5s
   * since the last LayoutShift event.
   * @param {Array<LayoutShiftEvent>} layoutShiftEvents
   * @return {number}
   */
  static avgSessionGap5s(layoutShiftEvents) {
    if (layoutShiftEvents.length === 0) return 0;

    let score = 0;
    let clusterCount = 0;
    let prevTs = Number.NEGATIVE_INFINITY;

    for (const event of layoutShiftEvents) {
      if (event.ts - prevTs > 5_000_000) clusterCount++;
      prevTs = event.ts;
      score += event.score;
    }

    return score / clusterCount;
  }

  /**
   * Calculates cumulative layout shifts per cluster (session) of LayoutShift
   * events -- where a new cluster is created when there's a gap of more than
   * `gapMs` ms since the last LayoutShift event or the cluster is greater than
   * `limitMs` ms long -- and returns the max LayoutShift score found.
   * `limitMs` is optional if no limit is needed.
   * @param {Array<LayoutShiftEvent>} layoutShiftEvents
   * @param {number} gapMs
   * @param {number} [limitMs]
   */
  static maxSession(layoutShiftEvents, gapMs, limitMs = Number.POSITIVE_INFINITY) {
    let maxScore = 0;
    let currentClusterScore = 0;
    let firstTs = Number.NEGATIVE_INFINITY;
    let prevTs = Number.NEGATIVE_INFINITY;

    for (const event of layoutShiftEvents) {
      if (event.ts - firstTs > limitMs * 1000 || event.ts - prevTs > gapMs * 1000) {
        firstTs = event.ts;
        currentClusterScore = 0;
      }
      prevTs = event.ts;
      currentClusterScore += event.score;
      maxScore = Math.max(maxScore, currentClusterScore);
    }

    return maxScore;
  }

  /**
   * Returns the maximum cumulative layout shift in any `windowMs` ms window
   * (inclusive of bounds) in the trace.
   * @param {Array<LayoutShiftEvent>} layoutShiftEvents
   * @param {number} windowMs
   * @return {number}
   */
  static maxSliding(layoutShiftEvents, windowMs) {
    let maxScore = 0;
    let currentWindowScore = 0;
    const windowEvents = [];

    for (const event of layoutShiftEvents) {
      while (windowEvents.length && event.ts - windowEvents[0].ts > windowMs * 1000) {
        currentWindowScore -= windowEvents[0].score;
        windowEvents.shift();
      }
      windowEvents.push(event);
      currentWindowScore += event.score;
      maxScore = Math.max(maxScore, currentWindowScore);
    }

    return maxScore;
  }

  /**
   * Returns all LayoutShift events that had no recent input.
   * @param {LH.TraceEvent[]} traceEvents
   * @return {Array<LayoutShiftEvent>}
   */
  static getLayoutShiftEvents(traceEvents) {
    const layoutShiftEvents = [];

    // Chromium will set `had_recent_input` if there was recent user input, which
    // skips shift events from contributing to CLS. This flag is also set when
    // Lighthouse changes the emulation size. This results in the first few shift
    // events having `had_recent_input` set, so ignore it for those events.
    // See https://bugs.chromium.org/p/chromium/issues/detail?id=1094974.
    let ignoreHadRecentInput = true;

    for (const event of traceEvents) {
      if (event.name !== 'LayoutShift' ||
          !event.args.data ||
          event.args.data.is_main_frame === undefined ||
          event.args.data.score === undefined) { // Keep tsc happy, but a score-less event would be useless regardless.
        continue;
      }

      if (event.args.data.had_recent_input) {
        // `had_recent_input` events aren't used unless currently ignoring.
        if (!ignoreHadRecentInput) continue;
      } else {
        // After a false `had_recent_input`, stop ignoring property.
        ignoreHadRecentInput = false;
      }

      layoutShiftEvents.push({
        ts: event.ts,
        score: event.args.data.score,
        isMainFrame: event.args.data.is_main_frame,
        weightedScoreDelta: event.args.data.weighted_score_delta,
      });
    }

    return layoutShiftEvents;
  }

  /**
   * @param {LH.Trace} trace
   * @param {LH.Audit.Context} context
   * @return {Promise<{avgSessionGap5s: number, maxSessionGap1s: number, maxSessionGap1sLimit5s: number, maxSliding1s: number, maxSliding300ms: number}>}
   */
  static async compute_(trace, context) {
    const traceOfTab = await TraceOfTab.request(trace, context);
    const layoutShiftEvents = LayoutShiftVariants.getLayoutShiftEvents(traceOfTab.mainThreadEvents)
      .filter(e => e.isMainFrame); // Only main frame for now.

    return {
      avgSessionGap5s: LayoutShiftVariants.avgSessionGap5s(layoutShiftEvents),
      maxSessionGap1s: LayoutShiftVariants.maxSession(layoutShiftEvents, 1000),
      maxSessionGap1sLimit5s: LayoutShiftVariants.maxSession(layoutShiftEvents, 1000, 5000),
      maxSliding1s: LayoutShiftVariants.maxSliding(layoutShiftEvents, 1000),
      maxSliding300ms: LayoutShiftVariants.maxSliding(layoutShiftEvents, 300),
    };
  }
}

module.exports = makeComputedArtifact(LayoutShiftVariants);
