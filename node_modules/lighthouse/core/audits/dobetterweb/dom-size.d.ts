export default DOMSize;
declare class DOMSize extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../../types/audit.js").default.ScoreOptions;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<number|undefined>}
     */
    static computeTbtImpact(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<number | undefined>;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnStatistic: string;
    const columnValue: string;
    const displayValue: string;
    const statisticDOMElements: string;
    const statisticDOMDepth: string;
    const statisticDOMWidth: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=dom-size.d.ts.map