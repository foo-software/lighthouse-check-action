export default InteractionToNextPaint;
/**
 * @fileoverview This metric gives a high-percentile measure of responsiveness to input.
 */
declare class InteractionToNextPaint extends Audit {
    /**
     * @return {LH.Audit.ScoreOptions}
     */
    static get defaultOptions(): import("../../../types/audit.js").default.ScoreOptions;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const description: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=interaction-to-next-paint.d.ts.map