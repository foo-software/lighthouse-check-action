export { MainResourceComputed as MainResource };
declare const MainResourceComputed: typeof MainResource & {
    request: (dependencies: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../lib/network-request.js").NetworkRequest>;
};
/**
 * @fileoverview This artifact identifies the main resource on the page. Current solution assumes
 * that the main resource is the first non-redirected one.
 */
declare class MainResource {
    /**
     * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.NetworkRequest>}
     */
    static compute_(data: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.NetworkRequest>;
}
//# sourceMappingURL=main-resource.d.ts.map