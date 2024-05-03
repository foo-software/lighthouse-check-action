/// <reference path="../../../../../types/internal/parse-cache-control.d.ts" />
export default CacheHeaders;
declare class CacheHeaders extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../../types/audit.js").default.ScoreOptions;
    /**
     * Computes the percent likelihood that a return visit will be within the cache lifetime, based on
     * Chrome UMA stats see the note below.
     * @param {number} maxAgeInSeconds
     * @return {number}
     */
    static getCacheHitProbability(maxAgeInSeconds: number): number;
    /**
     * Return max-age if defined, otherwise expires header if defined, and null if not.
     * @param {Map<string, string>} headers
     * @param {ReturnType<typeof parseCacheControl>} cacheControl
     * @return {?number}
     */
    static computeCacheLifetimeInSeconds(headers: Map<string, string>, cacheControl: ReturnType<typeof parseCacheControl>): number | null;
    /**
     * Given a network record, returns whether we believe the asset is cacheable, i.e. it was a network
     * request that satisifed the conditions:
     *
     *  1. Has a cacheable status code
     *  2. Has a resource type that corresponds to static assets (image, script, stylesheet, etc).
     *
     * Allowing assets with a query string is debatable, PSI considered them non-cacheable with a similar
     * caveat.
     *
     * TODO: Investigate impact in HTTPArchive, experiment with this policy to see what changes.
     *
     * @param {LH.Artifacts.NetworkRequest} record
     * @return {boolean}
     */
    static isCacheableAsset(record: LH.Artifacts.NetworkRequest): boolean;
    /**
     * Returns true if headers suggest a record should not be cached for a long time.
     * @param {Map<string, string>} headers
     * @param {ReturnType<typeof parseCacheControl>} cacheControl
     * @return {boolean}
     */
    static shouldSkipRecord(headers: Map<string, string>, cacheControl: ReturnType<typeof parseCacheControl>): boolean;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const displayValue: string;
}
import { Audit } from '../audit.js';
import parseCacheControl from 'parse-cache-control';
import { NetworkRequest } from '../../lib/network-request.js';
//# sourceMappingURL=uses-long-cache-ttl.d.ts.map