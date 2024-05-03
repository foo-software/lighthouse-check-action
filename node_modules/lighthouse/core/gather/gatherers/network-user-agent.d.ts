export default NetworkUserAgent;
/** @implements {LH.Gatherer.GathererInstance<'DevtoolsLog'>} */
declare class NetworkUserAgent extends BaseGatherer implements LH.Gatherer.GathererInstance<'DevtoolsLog'> {
    /**
     * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
     * @return {string}
     */
    static getNetworkUserAgent(devtoolsLog: LH.Artifacts['DevtoolsLog']): string;
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['NetworkUserAgent']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['NetworkUserAgent']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=network-user-agent.d.ts.map