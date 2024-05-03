export default BaseGatherer;
/**
 * Base class for all gatherers.
 *
 * @implements {LH.Gatherer.GathererInstance}
 */
declare class BaseGatherer implements LH.Gatherer.GathererInstance {
    /** @type {LH.Gatherer.GathererMeta} */
    meta: LH.Gatherer.GathererMeta;
    /**
     * Method to start observing a page for an arbitrary period of time.
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<void>|void}
     */
    startInstrumentation(passContext: LH.Gatherer.Context): Promise<void> | void;
    /**
     * Method to start observing a page when the measurements are very sensitive and
     * should observe as little Lighthouse-induced work as possible.
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<void>|void}
     */
    startSensitiveInstrumentation(passContext: LH.Gatherer.Context): Promise<void> | void;
    /**
     * Method to stop observing a page when the measurements are very sensitive and
     * should observe as little Lighthouse-induced work as possible.
     *
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<void>|void}
     */
    stopSensitiveInstrumentation(passContext: LH.Gatherer.Context): Promise<void> | void;
    /**
     * Method to end observing a page after an arbitrary period of time.
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<void>|void}
     */
    stopInstrumentation(passContext: LH.Gatherer.Context): Promise<void> | void;
    /**
     * Method to gather results about a page.
     * @param {LH.Gatherer.Context} passContext
     * @return {LH.Gatherer.PhaseResult}
     */
    getArtifact(passContext: LH.Gatherer.Context): LH.Gatherer.PhaseResult;
}
import * as LH from '../../types/lh.js';
//# sourceMappingURL=base-gatherer.d.ts.map