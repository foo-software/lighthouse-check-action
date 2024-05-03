export default CacheContents;
declare class CacheContents extends BaseGatherer {
    /**
     * Creates an array of cached URLs.
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts['CacheContents']>}
     */
    getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts['CacheContents']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=cache-contents.d.ts.map