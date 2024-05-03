export default RootCauses;
declare class RootCauses extends BaseGatherer {
    static symbol: symbol;
    /**
     * @param {LH.Gatherer.Driver} driver
     * @param {LH.Artifacts.TraceEngineResult['data']} traceParsedData
     * @return {Promise<LH.Artifacts.TraceEngineRootCauses>}
     */
    static runRootCauseAnalysis(driver: LH.Gatherer.Driver, traceParsedData: LH.Artifacts.TraceEngineResult['data']): Promise<LH.Artifacts.TraceEngineRootCauses>;
    /** @type {LH.Gatherer.GathererMeta<'Trace'>} */
    meta: LH.Gatherer.GathererMeta<'Trace'>;
    /**
     * @param {LH.Gatherer.Context<'Trace'>} context
     * @return {Promise<LH.Artifacts.TraceEngineRootCauses>}
     */
    getArtifact(context: LH.Gatherer.Context<'Trace'>): Promise<LH.Artifacts.TraceEngineRootCauses>;
}
import BaseGatherer from '../base-gatherer.js';
import { TraceEngineResult } from '../../computed/trace-engine-result.js';
//# sourceMappingURL=root-causes.d.ts.map