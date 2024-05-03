export default FullPageScreenshot;
declare class FullPageScreenshot extends BaseGatherer {
    /**
     * @param {LH.Gatherer.Context} context
     */
    waitForNetworkIdle(context: LH.Gatherer.Context): import("../driver/wait-for-condition.js").CancellableWait<void>;
    /**
     * @param {LH.Gatherer.Context} context
     * @param {{height: number, width: number, mobile: boolean}} deviceMetrics
     */
    _resizeViewport(context: LH.Gatherer.Context, deviceMetrics: {
        height: number;
        width: number;
        mobile: boolean;
    }): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Result.FullPageScreenshot['screenshot']>}
     */
    _takeScreenshot(context: LH.Gatherer.Context): Promise<LH.Result.FullPageScreenshot['screenshot']>;
    /**
     * Gatherers can collect details about DOM nodes, including their position on the page.
     * Layout shifts occuring after a gatherer runs can cause these positions to be incorrect,
     * resulting in a poor experience for element screenshots.
     * `getNodeDetails` maintains a collection of DOM objects in the page, which we can iterate
     * to re-collect the bounding client rectangle.
     * @see pageFunctions.getNodeDetails
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Result.FullPageScreenshot['nodes']>}
     */
    _resolveNodes(context: LH.Gatherer.Context): Promise<LH.Result.FullPageScreenshot['nodes']>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Artifacts['FullPageScreenshot']>}
     */
    getArtifact(context: LH.Gatherer.Context): Promise<LH.Artifacts['FullPageScreenshot']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=full-page-screenshot.d.ts.map