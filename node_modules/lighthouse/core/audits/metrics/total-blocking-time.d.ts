export default TotalBlockingTime;
declare class TotalBlockingTime extends Audit {
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
     * Audits the page to calculate Total Blocking Time.
     *
     * We define Blocking Time as any time interval in the loading timeline where task length exceeds
     * 50ms. For example, if there is a 110ms main thread task, the last 60ms of it is blocking time.
     * Total Blocking Time is the sum of all Blocking Time between First Contentful Paint and
     * Interactive Time (TTI).
     *
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
//# sourceMappingURL=total-blocking-time.d.ts.map