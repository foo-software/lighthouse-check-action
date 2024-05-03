export default Scripts;
/**
 * @fileoverview Gets JavaScript file contents.
 */
declare class Scripts extends BaseGatherer {
    static symbol: symbol;
    /** @type {LH.Crdp.Debugger.ScriptParsedEvent[]} */
    _scriptParsedEvents: LH.Crdp.Debugger.ScriptParsedEvent[];
    /** @type {Array<string | undefined>} */
    _scriptContents: Array<string | undefined>;
    /**
     * @param {LH.Crdp.Debugger.ScriptParsedEvent} params
     */
    onScriptParsed(params: LH.Crdp.Debugger.ScriptParsedEvent): void;
    /**
     * @param {LH.Gatherer.Context} context
     */
    startInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     */
    stopInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    getArtifact(): Promise<import("../../index.js").Artifacts.Script[]>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=scripts.d.ts.map