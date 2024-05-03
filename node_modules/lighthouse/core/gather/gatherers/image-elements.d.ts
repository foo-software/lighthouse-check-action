export default ImageElements;
declare class ImageElements extends BaseGatherer {
    /** @type {Map<string, {naturalWidth: number, naturalHeight: number}>} */
    _naturalSizeCache: Map<string, {
        naturalWidth: number;
        naturalHeight: number;
    }>;
    /**
     * @param {LH.Gatherer.Driver} driver
     * @param {LH.Artifacts.ImageElement} element
     */
    fetchElementWithSizeInformation(driver: LH.Gatherer.Driver, element: LH.Artifacts.ImageElement): Promise<void>;
    /**
     * Images might be sized via CSS. In order to compute unsized-images failures, we need to collect
     * matched CSS rules to see if this is the case.
     * @url http://go/dwoqq (googlers only)
     * @param {LH.Gatherer.ProtocolSession} session
     * @param {string} devtoolsNodePath
     * @param {LH.Artifacts.ImageElement} element
     */
    fetchSourceRules(session: LH.Gatherer.ProtocolSession, devtoolsNodePath: string, element: LH.Artifacts.ImageElement): Promise<void>;
    /**
     *
     * @param {LH.Gatherer.Driver} driver
     * @param {LH.Artifacts.ImageElement[]} elements
     */
    collectExtraDetails(driver: LH.Gatherer.Driver, elements: LH.Artifacts.ImageElement[]): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Artifacts['ImageElements']>}
     */
    getArtifact(context: LH.Gatherer.Context): Promise<LH.Artifacts['ImageElements']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=image-elements.d.ts.map