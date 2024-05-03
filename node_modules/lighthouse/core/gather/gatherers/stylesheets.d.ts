export default Stylesheets;
declare class Stylesheets extends BaseGatherer {
    /** @type {LH.Gatherer.ProtocolSession|undefined} */
    _session: LH.Gatherer.ProtocolSession | undefined;
    /** @type {Map<string, Promise<LH.Artifacts.CSSStyleSheetInfo|null>>} */
    _sheetPromises: Map<string, Promise<LH.Artifacts.CSSStyleSheetInfo | null>>;
    /**
     * @param {LH.Crdp.CSS.StyleSheetAddedEvent} event
     */
    _onStylesheetAdded(event: LH.Crdp.CSS.StyleSheetAddedEvent): void;
    /**
     * @param {LH.Gatherer.Context} context
     */
    startInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     */
    stopInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Artifacts['Stylesheets']>}
     */
    getArtifact(context: LH.Gatherer.Context): Promise<LH.Artifacts['Stylesheets']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=stylesheets.d.ts.map