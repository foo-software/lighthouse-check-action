export default BFCacheFailures;
declare class BFCacheFailures extends BaseGatherer {
    /**
     * @param {LH.Crdp.Page.BackForwardCacheNotRestoredExplanation[]} errorList
     * @return {LH.Artifacts.BFCacheFailure}
     */
    static processBFCacheEventList(errorList: LH.Crdp.Page.BackForwardCacheNotRestoredExplanation[]): LH.Artifacts.BFCacheFailure;
    /**
     * @param {LH.Crdp.Page.BackForwardCacheNotRestoredExplanationTree} errorTree
     * @return {LH.Artifacts.BFCacheFailure}
     */
    static processBFCacheEventTree(errorTree: LH.Crdp.Page.BackForwardCacheNotRestoredExplanationTree): LH.Artifacts.BFCacheFailure;
    /**
     * @param {LH.Crdp.Page.BackForwardCacheNotUsedEvent|undefined} event
     * @return {LH.Artifacts.BFCacheFailure}
     */
    static processBFCacheEvent(event: LH.Crdp.Page.BackForwardCacheNotUsedEvent | undefined): LH.Artifacts.BFCacheFailure;
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Crdp.Page.BackForwardCacheNotUsedEvent|undefined>}
     */
    activelyCollectBFCacheEvent(context: LH.Gatherer.Context): Promise<LH.Crdp.Page.BackForwardCacheNotUsedEvent | undefined>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {LH.Crdp.Page.BackForwardCacheNotUsedEvent[]}
     */
    passivelyCollectBFCacheEvents(context: LH.Gatherer.Context<'DevtoolsLog'>): LH.Crdp.Page.BackForwardCacheNotUsedEvent[];
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['BFCacheFailures']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['BFCacheFailures']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=bf-cache-failures.d.ts.map