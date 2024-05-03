export default DevtoolsLogCompat;
/** @implements {LH.Gatherer.GathererInstance<'DevtoolsLog'>} */
declare class DevtoolsLogCompat extends BaseGatherer implements LH.Gatherer.GathererInstance<'DevtoolsLog'> {
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} passContext
     * @return {Promise<LH.Artifacts['devtoolsLogs']>}
     */
    getArtifact(passContext: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['devtoolsLogs']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=devtools-log-compat.d.ts.map