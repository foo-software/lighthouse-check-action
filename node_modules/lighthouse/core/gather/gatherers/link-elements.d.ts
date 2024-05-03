export default LinkElements;
declare class LinkElements extends BaseGatherer {
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Artifacts['LinkElements']>}
     */
    static getLinkElementsInDOM(context: LH.Gatherer.Context): Promise<LH.Artifacts['LinkElements']>;
    /**
     * @param {LH.Gatherer.Context} context
     * @param {LH.Artifacts['DevtoolsLog']} devtoolsLog
     * @return {Promise<LH.Artifacts['LinkElements']>}
     */
    static getLinkElementsInHeaders(context: LH.Gatherer.Context, devtoolsLog: LH.Artifacts['DevtoolsLog']): Promise<LH.Artifacts['LinkElements']>;
    /**
     * This needs to be in the constructor.
     * https://github.com/GoogleChrome/lighthouse/issues/12134
     * @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>}
     */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['LinkElements']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['LinkElements']>;
}
export namespace UIStrings {
    const headerParseWarning: string;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=link-elements.d.ts.map