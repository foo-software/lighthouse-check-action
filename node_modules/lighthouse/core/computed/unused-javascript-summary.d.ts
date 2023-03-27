export { UnusedJavascriptSummaryComputed as UnusedJavascriptSummary };
export type WasteData = {
    unusedByIndex: Uint8Array;
    unusedLength: number;
    contentLength: number;
};
export type ComputeInput = {
    scriptId: string;
    scriptCoverage: Omit<LH.Crdp.Profiler.ScriptCoverage, 'url'>;
    bundle?: LH.Artifacts.Bundle | undefined;
};
export type Summary = {
    scriptId: string;
    wastedBytes: number;
    totalBytes: number;
    wastedPercent?: number | undefined;
    /**
     * Keyed by file name. Includes (unmapped) key too.
     */
    sourcesWastedBytes?: Record<string, number> | undefined;
};
declare const UnusedJavascriptSummaryComputed: typeof UnusedJavascriptSummary & {
    request: (dependencies: ComputeInput, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<Summary>;
};
/**
 * @typedef WasteData
 * @property {Uint8Array} unusedByIndex
 * @property {number} unusedLength
 * @property {number} contentLength
 */
/**
 * @typedef ComputeInput
 * @property {string} scriptId
 * @property {Omit<LH.Crdp.Profiler.ScriptCoverage, 'url'>} scriptCoverage
 * @property {LH.Artifacts.Bundle=} bundle
 */
/**
 * @typedef Summary
 * @property {string} scriptId
 * @property {number} wastedBytes
 * @property {number} totalBytes
 * @property {number} wastedBytes
 * @property {number=} wastedPercent
 * @property {Record<string, number>=} sourcesWastedBytes Keyed by file name. Includes (unmapped) key too.
 */
declare class UnusedJavascriptSummary {
    /**
     * @param {Omit<LH.Crdp.Profiler.ScriptCoverage, 'url'>} scriptCoverage
     * @return {WasteData}
     */
    static computeWaste(scriptCoverage: Omit<LH.Crdp.Profiler.ScriptCoverage, 'url'>): WasteData;
    /**
     * @param {string} scriptId
     * @param {WasteData} wasteData
     * @return {Summary}
     */
    static createItem(scriptId: string, wasteData: WasteData): Summary;
    /**
     * @param {WasteData} wasteData
     * @param {LH.Artifacts.Bundle} bundle
     */
    static createSourceWastedBytes(wasteData: WasteData, bundle: LH.Artifacts.Bundle): Record<string, number> | undefined;
    /**
     * @param {ComputeInput} data
     * @return {Promise<Summary>}
     */
    static compute_(data: ComputeInput): Promise<Summary>;
}
//# sourceMappingURL=unused-javascript-summary.d.ts.map