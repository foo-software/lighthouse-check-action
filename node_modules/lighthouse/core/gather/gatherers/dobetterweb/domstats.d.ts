export default DOMStats;
declare class DOMStats extends BaseGatherer {
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts['DOMStats']>}
     */
    getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts['DOMStats']>;
}
import BaseGatherer from '../../base-gatherer.js';
//# sourceMappingURL=domstats.d.ts.map