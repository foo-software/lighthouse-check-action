export { SpeedlineComputed as Speedline };
declare const SpeedlineComputed: typeof Speedline & {
    request: (dependencies: import("../index.js").Trace, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../index.js").Artifacts.Speedline>;
};
declare class Speedline {
    /**
     * @param {LH.Trace} trace
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.Speedline>}
     */
    static compute_(trace: LH.Trace, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.Speedline>;
}
//# sourceMappingURL=speedline.d.ts.map