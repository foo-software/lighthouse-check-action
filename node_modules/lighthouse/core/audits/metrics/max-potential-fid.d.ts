export default MaxPotentialFID;
export type LoafDebugDetails = {
    type: 'debugdata';
    observedMaxDurationLoaf?: LH.TraceEvent | undefined;
    observedMaxBlockingLoaf?: LH.TraceEvent | undefined;
    observedLoafs: Array<{
        startTime: number;
        duration: number;
        blockingDuration: number;
    }>;
};
/**
 * @fileoverview This metric is the duration of the longest task after FCP. It is meant to capture
 * the worst case First Input Delay that a user might experience.
 * Tasks before FCP are excluded because it is unlikely that the user will try to interact with a page before it has painted anything.
 */
declare class MaxPotentialFID extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../../types/audit.js").default.ScoreOptions;
    /**
     * Extract potential LoAF replacements for MPFID from the trace to log in
     * debugdata details.
     * @param {LH.Artifacts.ProcessedTrace} processedTrace
     * @param {LH.Artifacts.ProcessedNavigation} processedNavigation
     * @return {LoafDebugDetails|undefined}
     */
    static getLongAnimationFrameDetails(processedTrace: LH.Artifacts.ProcessedTrace, processedNavigation: LH.Artifacts.ProcessedNavigation): LoafDebugDetails | undefined;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const description: string;
}
import { Audit } from '../audit.js';
import { ProcessedTrace } from '../../computed/processed-trace.js';
import { ProcessedNavigation } from '../../computed/processed-navigation.js';
//# sourceMappingURL=max-potential-fid.d.ts.map