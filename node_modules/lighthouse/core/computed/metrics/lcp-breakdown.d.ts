export { LCPBreakdownComputed as LCPBreakdown };
declare const LCPBreakdownComputed: typeof LCPBreakdown & {
    request: (dependencies: import("../../index.js").Artifacts.MetricComputationDataInput, context: import("../../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<{
        ttfb: number;
        loadStart?: number | undefined;
        loadEnd?: number | undefined;
    }>;
};
declare class LCPBreakdown {
    /**
     * @param {LH.Artifacts.MetricComputationDataInput} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<{ttfb: number, loadStart?: number, loadEnd?: number}>}
     */
    static compute_(data: LH.Artifacts.MetricComputationDataInput, context: LH.Artifacts.ComputedContext): Promise<{
        ttfb: number;
        loadStart?: number | undefined;
        loadEnd?: number | undefined;
    }>;
}
//# sourceMappingURL=lcp-breakdown.d.ts.map