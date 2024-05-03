export { CumulativeLayoutShiftComputed as CumulativeLayoutShift };
export type LayoutShiftEvent = {
    ts: number;
    isMainFrame: boolean;
    weightedScore: number;
    impactedNodes?: LH.Artifacts.TraceImpactedNode[];
    event: LH.TraceEvent;
};
declare const CumulativeLayoutShiftComputed: typeof CumulativeLayoutShift & {
    request: (dependencies: import("../../index.js").Trace, context: import("../../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<{
        cumulativeLayoutShift: number;
        cumulativeLayoutShiftMainFrame: number;
        impactByNodeId: Map<number, number>;
        newEngineResult?: {
            cumulativeLayoutShift: number;
            cumulativeLayoutShiftMainFrame: number;
        } | undefined;
        newEngineResultDiffered: boolean;
    }>;
};
declare class CumulativeLayoutShift {
    /**
     * Returns all LayoutShift events that had no recent input.
     * Only a `weightedScore` per event is returned. For non-main-frame events, this is
     * the only score that matters. For main-frame events, `weighted_score_delta === score`.
     * @see https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/layout/layout_shift_tracker.cc;l=492-495;drc=de3b3a8a8839269c6b44403fa38a13a1ed12fed5
     * @param {LH.Artifacts.ProcessedTrace} processedTrace
     * @return {Array<LayoutShiftEvent>}
     */
    static getLayoutShiftEvents(processedTrace: LH.Artifacts.ProcessedTrace): Array<LayoutShiftEvent>;
    /**
     * Each layout shift event has a 'score' which is the amount added to the CLS as a result of the given shift(s).
     * We calculate the score per element by taking the 'score' of each layout shift event and
     * distributing it between all the nodes that were shifted, proportianal to the impact region of
     * each shifted element.
     *
     * @param {LayoutShiftEvent[]} layoutShiftEvents
     * @return {Map<number, number>}
     */
    static getImpactByNodeId(layoutShiftEvents: LayoutShiftEvent[]): Map<number, number>;
    /**
     * Calculates cumulative layout shifts per cluster (session) of LayoutShift
     * events -- where a new cluster is created when there's a gap of more than
     * 1000ms since the last LayoutShift event or the cluster is greater than
     * 5000ms long -- and returns the max LayoutShift score found.
     * @param {Array<LayoutShiftEvent>} layoutShiftEvents
     * @return {number}
     */
    static calculate(layoutShiftEvents: Array<LayoutShiftEvent>): number;
    /**
     * @param {LayoutShiftEvent[]} allFrameShiftEvents
     * @param {LayoutShiftEvent[]} mainFrameShiftEvents
     */
    static computeWithSharedTraceEngine(allFrameShiftEvents: LayoutShiftEvent[], mainFrameShiftEvents: LayoutShiftEvent[]): Promise<{
        cumulativeLayoutShift: number;
        cumulativeLayoutShiftMainFrame: number;
    }>;
    /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{cumulativeLayoutShift: number, cumulativeLayoutShiftMainFrame: number, impactByNodeId: Map<number, number>, newEngineResult?: {cumulativeLayoutShift: number, cumulativeLayoutShiftMainFrame: number}, newEngineResultDiffered: boolean}>}
     */
    static compute_(trace: LH.Trace, context: LH.Artifacts.ComputedContext): Promise<{
        cumulativeLayoutShift: number;
        cumulativeLayoutShiftMainFrame: number;
        impactByNodeId: Map<number, number>;
        newEngineResult?: {
            cumulativeLayoutShift: number;
            cumulativeLayoutShiftMainFrame: number;
        } | undefined;
        newEngineResultDiffered: boolean;
    }>;
}
import { ProcessedTrace } from '../processed-trace.js';
//# sourceMappingURL=cumulative-layout-shift.d.ts.map