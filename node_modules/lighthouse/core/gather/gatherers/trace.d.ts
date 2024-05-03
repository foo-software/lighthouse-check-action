export default Trace;
declare class Trace extends BaseGatherer {
    static getDefaultTraceCategories(): string[];
    /**
     * @param {LH.Gatherer.ProtocolSession} session
     * @return {Promise<LH.Trace>}
     */
    static endTraceAndCollectEvents(session: LH.Gatherer.ProtocolSession): Promise<LH.Trace>;
    static symbol: symbol;
    /** @type {LH.Trace} */
    _trace: LH.Trace;
    /**
     * @param {LH.Gatherer.Context} passContext
     */
    startSensitiveInstrumentation({ driver, gatherMode, settings }: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} passContext
     */
    stopSensitiveInstrumentation({ driver }: LH.Gatherer.Context): Promise<void>;
    getDebugData(): import("../../index.js").Trace;
    getArtifact(): import("../../index.js").Trace;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=trace.d.ts.map