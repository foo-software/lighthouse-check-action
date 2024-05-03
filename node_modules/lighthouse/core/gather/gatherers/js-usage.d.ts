export default JsUsage;
/**
 * @fileoverview Tracks unused JavaScript
 */
declare class JsUsage extends BaseGatherer {
    /** @type {LH.Crdp.Profiler.ScriptCoverage[]} */
    _scriptUsages: LH.Crdp.Profiler.ScriptCoverage[];
    /**
     * @param {LH.Gatherer.Context} context
     */
    startInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     */
    stopInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @return {Promise<LH.Artifacts['JsUsage']>}
     */
    getArtifact(): Promise<LH.Artifacts['JsUsage']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=js-usage.d.ts.map