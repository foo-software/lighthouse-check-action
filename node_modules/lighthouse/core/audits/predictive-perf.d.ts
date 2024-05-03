export default PredictivePerf;
declare class PredictivePerf extends Audit {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
import { Audit } from './audit.js';
//# sourceMappingURL=predictive-perf.d.ts.map