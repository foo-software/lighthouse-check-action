export default IFrameElements;
declare class IFrameElements extends BaseGatherer {
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<LH.Artifacts['IFrameElements']>}
     * @override
     */
    override getArtifact(passContext: LH.Gatherer.Context): Promise<LH.Artifacts['IFrameElements']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=iframe-elements.d.ts.map