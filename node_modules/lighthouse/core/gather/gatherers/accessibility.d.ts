export default Accessibility;
declare class Accessibility extends BaseGatherer {
    static pageFns: {
        runA11yChecks: typeof runA11yChecks;
        createAxeRuleResultArtifact: typeof createAxeRuleResultArtifact;
    };
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts.Accessibility>}
     */
    getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts.Accessibility>;
}
import BaseGatherer from '../base-gatherer.js';
/**
 * @return {Promise<LH.Artifacts.Accessibility>}
 */
declare function runA11yChecks(): Promise<LH.Artifacts.Accessibility>;
/**
 * @param {import('axe-core/axe').Result} result
 * @return {LH.Artifacts.AxeRuleResult}
 */
declare function createAxeRuleResultArtifact(result: import('axe-core/axe').Result): LH.Artifacts.AxeRuleResult;
//# sourceMappingURL=accessibility.d.ts.map