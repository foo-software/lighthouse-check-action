export { LCPImageRecordComputed as LCPImageRecord };
declare const LCPImageRecordComputed: typeof LCPImageRecord & {
    request: (dependencies: {
        trace: LH.Trace;
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../lib/network-request.js").NetworkRequest | undefined>;
};
/**
 * @fileoverview Match the LCP event with the paint event to get the request of the image actually painted.
 * This could differ from the `ImageElement` associated with the nodeId if e.g. the LCP
 * was a pseudo-element associated with a node containing a smaller background-image.
 */
declare class LCPImageRecord {
    /**
     * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.NetworkRequest|undefined>}
     */
    static compute_(data: {
        trace: LH.Trace;
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.NetworkRequest | undefined>;
}
//# sourceMappingURL=lcp-image-record.d.ts.map