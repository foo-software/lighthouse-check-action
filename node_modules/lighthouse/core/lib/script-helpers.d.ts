/**
 * @param {LH.Artifacts.NetworkRequest[]} networkRecords
 * @param {LH.Artifacts.Script} script
 * @return {LH.Artifacts.NetworkRequest|undefined}
 */
export function getRequestForScript(networkRecords: LH.Artifacts.NetworkRequest[], script: LH.Artifacts.Script): LH.Artifacts.NetworkRequest | undefined;
/**
 * @param {LH.Artifacts.Script} script
 * @return {boolean}
 */
export function isInline(script: LH.Artifacts.Script): boolean;
/**
 * Estimates the number of bytes the content of this network record would have consumed on the network based on the
 * uncompressed size (totalBytes). Uses the actual transfer size from the network record if applicable,
 * minus the size of the response headers.
 *
 * This differs from `estimateTransferSize` only in that is subtracts the response headers from the estimate.
 *
 * @param {LH.Artifacts.NetworkRequest|undefined} networkRecord
 * @param {number} totalBytes Uncompressed size of the resource
 * @param {LH.Crdp.Network.ResourceType=} resourceType
 * @return {number}
 */
export function estimateCompressedContentSize(networkRecord: LH.Artifacts.NetworkRequest | undefined, totalBytes: number, resourceType?: LH.Crdp.Network.ResourceType | undefined): number;
/**
 * Estimates the number of bytes this network record would have consumed on the network based on the
 * uncompressed size (totalBytes). Uses the actual transfer size from the network record if applicable.
 *
 * @param {LH.Artifacts.NetworkRequest|undefined} networkRecord
 * @param {number} totalBytes Uncompressed size of the resource
 * @param {LH.Crdp.Network.ResourceType=} resourceType
 * @return {number}
 */
export function estimateTransferSize(networkRecord: LH.Artifacts.NetworkRequest | undefined, totalBytes: number, resourceType?: LH.Crdp.Network.ResourceType | undefined): number;
/**
 * Utility function to estimate the ratio of the compression on the resource.
 * This excludes the size of the response headers.
 * Also caches the calculation.
 * @param {Map<string, number>} compressionRatioByUrl
 * @param {string} url
 * @param {LH.Artifacts} artifacts
 * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
 */
export function estimateCompressionRatioForContent(compressionRatioByUrl: Map<string, number>, url: string, artifacts: LH.Artifacts, networkRecords: Array<LH.Artifacts.NetworkRequest>): number;
import { NetworkRequest } from './network-request.js';
//# sourceMappingURL=script-helpers.d.ts.map