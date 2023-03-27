export { ProcessedTraceComputed as ProcessedTrace };
declare const ProcessedTraceComputed: typeof ProcessedTrace & {
    request: (dependencies: import("../index.js").Trace, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../index.js").Artifacts.ProcessedTrace>;
};
declare class ProcessedTrace {
    /**
      * @param {LH.Trace} trace
      * @return {Promise<LH.Artifacts.ProcessedTrace>}
     */
    static compute_(trace: LH.Trace): Promise<LH.Artifacts.ProcessedTrace>;
}
//# sourceMappingURL=processed-trace.d.ts.map