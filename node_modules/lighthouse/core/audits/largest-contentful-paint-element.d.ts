export default LargestContentfulPaintElement;
declare class LargestContentfulPaintElement extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @return {LH.Audit.Details.Table|undefined}
     */
    static makeElementTable(artifacts: LH.Artifacts): LH.Audit.Details.Table | undefined;
    /**
     * @param {number} metricLcp
     * @param {LH.Artifacts.MetricComputationDataInput} metricComputationData
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Details.Table>}
     */
    static makePhaseTable(metricLcp: number, metricComputationData: LH.Artifacts.MetricComputationDataInput, context: LH.Audit.Context): Promise<LH.Audit.Details.Table>;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const description: string;
    const columnPhase: string;
    const columnPercentOfLCP: string;
    const columnTiming: string;
    const itemTTFB: string;
    const itemLoadDelay: string;
    const itemLoadTime: string;
    const itemRenderDelay: string;
}
import { Audit } from './audit.js';
//# sourceMappingURL=largest-contentful-paint-element.d.ts.map