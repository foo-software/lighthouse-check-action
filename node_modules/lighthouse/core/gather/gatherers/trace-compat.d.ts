export default TraceCompat;
/** @implements {LH.Gatherer.GathererInstance<'Trace'>} */
declare class TraceCompat extends BaseGatherer implements LH.Gatherer.GathererInstance<'Trace'> {
    /** @type {LH.Gatherer.GathererMeta<'Trace'>} */
    meta: LH.Gatherer.GathererMeta<'Trace'>;
    /**
     * @param {LH.Gatherer.Context<'Trace'>} passContext
     * @return {Promise<LH.Artifacts['traces']>}
     */
    getArtifact(passContext: LH.Gatherer.Context<'Trace'>): Promise<LH.Artifacts['traces']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=trace-compat.d.ts.map