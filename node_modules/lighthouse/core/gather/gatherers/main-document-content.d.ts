export default MainDocumentContent;
/**
 * Collects the content of the main html document.
 */
declare class MainDocumentContent extends BaseGatherer {
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['MainDocumentContent']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['MainDocumentContent']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=main-document-content.d.ts.map