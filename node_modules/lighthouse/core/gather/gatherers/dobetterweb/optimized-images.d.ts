export default OptimizedImages;
export type SimplifiedNetworkRecord = {
    requestId: string;
    url: string;
    mimeType: string;
    resourceSize: number;
};
/** @typedef {{requestId: string, url: string, mimeType: string, resourceSize: number}} SimplifiedNetworkRecord */
declare class OptimizedImages extends BaseGatherer {
    /**
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @return {Array<SimplifiedNetworkRecord>}
     */
    static filterImageRequests(networkRecords: Array<LH.Artifacts.NetworkRequest>): Array<SimplifiedNetworkRecord>;
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    _encodingStartAt: number;
    /**
     * @param {LH.Gatherer.ProtocolSession} session
     * @param {string} requestId
     * @param {'jpeg'|'webp'} encoding Either webp or jpeg.
     * @return {Promise<LH.Crdp.Audits.GetEncodedResponseResponse>}
     */
    _getEncodedResponse(session: LH.Gatherer.ProtocolSession, requestId: string, encoding: 'jpeg' | 'webp'): Promise<LH.Crdp.Audits.GetEncodedResponseResponse>;
    /**
     * @param {LH.Gatherer.ProtocolSession} session
     * @param {SimplifiedNetworkRecord} networkRecord
     * @return {Promise<{originalSize: number, jpegSize?: number, webpSize?: number}>}
     */
    calculateImageStats(session: LH.Gatherer.ProtocolSession, networkRecord: SimplifiedNetworkRecord): Promise<{
        originalSize: number;
        jpegSize?: number | undefined;
        webpSize?: number | undefined;
    }>;
    /**
     * @param {LH.Gatherer.ProtocolSession} session
     * @param {Array<SimplifiedNetworkRecord>} imageRecords
     * @return {Promise<LH.Artifacts['OptimizedImages']>}
     */
    computeOptimizedImages(session: LH.Gatherer.ProtocolSession, imageRecords: Array<SimplifiedNetworkRecord>): Promise<LH.Artifacts['OptimizedImages']>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['OptimizedImages']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['OptimizedImages']>;
}
import BaseGatherer from '../../base-gatherer.js';
import { NetworkRequest } from '../../../lib/network-request.js';
//# sourceMappingURL=optimized-images.d.ts.map