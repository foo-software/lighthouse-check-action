export type LHResult = import('../../types/lhr/lhr').default;
export type FlowResult = import('../../types/lhr/flow-result').default;
/** @typedef {import('../../types/lhr/lhr').default} LHResult */
/** @typedef {import('../../types/lhr/flow-result').default} FlowResult */
export class ReportGenerator {
    /**
     * Replaces all the specified strings in source without serial replacements.
     * @param {string} source
     * @param {!Array<{search: string, replacement: string}>} replacements
     * @return {string}
     */
    static replaceStrings(source: string, replacements: Array<{
        search: string;
        replacement: string;
    }>): string;
    /**
     * @param {unknown} object
     * @return {string}
     */
    static sanitizeJson(object: unknown): string;
    /**
     * Returns the standalone report HTML as a string with the report JSON and renderer JS inlined.
     * @param {LHResult} lhr
     * @return {string}
     */
    static generateReportHtml(lhr: LHResult): string;
    /**
     * Returns the standalone flow report HTML as a string with the report JSON and renderer JS inlined.
     * @param {FlowResult} flow
     * @return {string}
     */
    static generateFlowReportHtml(flow: FlowResult): string;
    /**
     * Converts the results to a CSV formatted string
     * Each row describes the result of 1 audit with
     *  - the name of the category the audit belongs to
     *  - the name of the audit
     *  - a description of the audit
     *  - the score type that is used for the audit
     *  - the score value of the audit
     *
     * @param {LHResult} lhr
     * @return {string}
     */
    static generateReportCSV(lhr: LHResult): string;
    /**
     * @param {LHResult|FlowResult} result
     * @return {result is FlowResult}
     */
    static isFlowResult(result: LHResult | FlowResult): result is import("../../types/lhr/flow-result").default;
    /**
     * Creates the results output in a format based on the `mode`.
     * @param {LHResult|FlowResult} result
     * @param {LHResult['configSettings']['output']} outputModes
     * @return {string|string[]}
     */
    static generateReport(result: LHResult | FlowResult, outputModes: LHResult['configSettings']['output']): string | string[];
}
//# sourceMappingURL=report-generator.d.ts.map