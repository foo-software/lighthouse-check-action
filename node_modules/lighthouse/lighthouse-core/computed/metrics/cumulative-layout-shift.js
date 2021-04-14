/**
 * @license Copyright 2019 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const makeComputedArtifact = require('../computed-artifact.js');
const TraceOfTab = require('../trace-of-tab.js');
const LayoutShiftVariants = require('../layout-shift-variants.js');

class CumulativeLayoutShift {
  /**
   * @param {LH.Trace} trace
   * @param {LH.Audit.Context} context
   * @return {Promise<{value: number, debugInfo: Record<string,boolean> | null}>}
   */
  static async compute_(trace, context) {
    const traceOfTab = await TraceOfTab.request(trace, context);
    const layoutShiftEvents = LayoutShiftVariants.getLayoutShiftEvents(traceOfTab.mainThreadEvents);

    const cumulativeLayoutShift = layoutShiftEvents
      .filter(e => e.isMainFrame)
      .reduce((sum, e) => sum += e.score, 0);

    return {
      value: cumulativeLayoutShift,
      debugInfo: {
        finalLayoutShiftTraceEventFound: Boolean(layoutShiftEvents.length),
      },
    };
  }
}

module.exports = makeComputedArtifact(CumulativeLayoutShift);
