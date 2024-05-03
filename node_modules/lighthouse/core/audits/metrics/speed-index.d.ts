export default SpeedIndex;
declare class SpeedIndex extends Audit {
    /**
     * @return {{mobile: {scoring: LH.Audit.ScoreOptions}, desktop: {scoring: LH.Audit.ScoreOptions}}}
     */
    static get defaultOptions(): {
        mobile: {
            scoring: LH.Audit.ScoreOptions;
        };
        desktop: {
            scoring: LH.Audit.ScoreOptions;
        };
    };
    /**
     * Audits the page to give a score for the Speed Index.
     * @see https://github.com/GoogleChrome/lighthouse/issues/197
     * @param {LH.Artifacts} artifacts The artifacts from the gather phase.
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const description: string;
}
import { Audit } from '../audit.js';
//# sourceMappingURL=speed-index.d.ts.map