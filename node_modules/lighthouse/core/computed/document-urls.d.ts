export { DocumentUrlsComputed as DocumentUrls };
declare const DocumentUrlsComputed: typeof DocumentUrls & {
    request: (dependencies: {
        trace: LH.Trace;
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<{
        requestedUrl: string;
        mainDocumentUrl: string;
    }>;
};
/**
 * @fileoverview Compute the navigation specific URLs `requestedUrl` and `mainDocumentUrl` in situations where
 * the `URL` artifact is not present. This is not a drop-in replacement for `URL` but can be helpful in situations
 * where getting the `URL` artifact is difficult.
 */
declare class DocumentUrls {
    /**
     * @param {{trace: LH.Trace, devtoolsLog: LH.DevtoolsLog}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{requestedUrl: string, mainDocumentUrl: string}>}
     */
    static compute_(data: {
        trace: LH.Trace;
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: LH.Artifacts.ComputedContext): Promise<{
        requestedUrl: string;
        mainDocumentUrl: string;
    }>;
}
//# sourceMappingURL=document-urls.d.ts.map