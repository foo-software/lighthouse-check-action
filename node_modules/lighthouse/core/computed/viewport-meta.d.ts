export { ViewportMetaComputed as ViewportMeta };
export type ViewportMetaResult = {
    /**
     * Whether the page has any viewport tag.
     */
    hasViewportTag: boolean;
    /**
     * Whether the viewport tag is optimized for mobile screens.
     */
    isMobileOptimized: boolean;
    /**
     * Warnings if the parser encountered invalid content in the viewport tag.
     */
    parserWarnings: Array<string>;
    /**
     * The `content` attribute value, if a viewport was defined.
     */
    rawContentString: string | undefined;
};
declare const ViewportMetaComputed: typeof ViewportMeta & {
    request: (dependencies: {
        name?: string | undefined;
        content?: string | undefined;
        property?: string | undefined;
        httpEquiv?: string | undefined;
        charset?: string | undefined;
        node: import("../index.js").Artifacts.NodeDetails;
    }[], context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<ViewportMetaResult>;
};
declare class ViewportMeta {
    /**
     * @param {LH.GathererArtifacts['MetaElements']} MetaElements
     * @return {Promise<ViewportMetaResult>}
    */
    static compute_(MetaElements: LH.GathererArtifacts['MetaElements']): Promise<ViewportMetaResult>;
}
//# sourceMappingURL=viewport-meta.d.ts.map