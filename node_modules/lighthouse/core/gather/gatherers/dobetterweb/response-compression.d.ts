export default ResponseCompression;
declare class ResponseCompression extends BaseGatherer {
    /**
     * @param {LH.Artifacts.NetworkRequest[]} networkRecords
     * @return {LH.Artifacts['ResponseCompression']}
     */
    static filterUnoptimizedResponses(networkRecords: LH.Artifacts.NetworkRequest[]): LH.Artifacts['ResponseCompression'];
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context} context
     * @param {LH.Artifacts.NetworkRequest[]} networkRecords
     * @return {Promise<LH.Artifacts['ResponseCompression']>}
     */
    getCompressibleRecords(context: LH.Gatherer.Context, networkRecords: LH.Artifacts.NetworkRequest[]): Promise<LH.Artifacts['ResponseCompression']>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['ResponseCompression']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['ResponseCompression']>;
}
import BaseGatherer from '../../base-gatherer.js';
import { NetworkRequest } from '../../../lib/network-request.js';
//# sourceMappingURL=response-compression.d.ts.map