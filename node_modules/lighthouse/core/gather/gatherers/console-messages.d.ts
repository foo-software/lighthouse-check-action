export default ConsoleMessages;
declare class ConsoleMessages extends BaseGatherer {
    /** @type {LH.Artifacts.ConsoleMessage[]} */
    _logEntries: LH.Artifacts.ConsoleMessage[];
    _onConsoleAPICalled: (event: LH.Crdp.Runtime.ConsoleAPICalledEvent) => void;
    _onExceptionThrown: (event: LH.Crdp.Runtime.ExceptionThrownEvent) => void;
    _onLogEntryAdded: (event: LH.Crdp.Log.EntryAddedEvent) => void;
    /**
     * Handles events for when a script invokes a console API.
     * @param {LH.Crdp.Runtime.ConsoleAPICalledEvent} event
     */
    onConsoleAPICalled(event: LH.Crdp.Runtime.ConsoleAPICalledEvent): void;
    /**
     * Handles exception thrown events.
     * @param {LH.Crdp.Runtime.ExceptionThrownEvent} event
     */
    onExceptionThrown(event: LH.Crdp.Runtime.ExceptionThrownEvent): void;
    /**
     * Handles browser reports logged to the console, including interventions,
     * deprecations, violations, and more.
     * @param {LH.Crdp.Log.EntryAddedEvent} event
     */
    onLogEntry(event: LH.Crdp.Log.EntryAddedEvent): void;
    /**
     * @param {LH.Gatherer.Context} passContext
     */
    startInstrumentation(passContext: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} passContext
     * @return {Promise<void>}
     */
    stopInstrumentation({ driver }: LH.Gatherer.Context): Promise<void>;
    /**
     * @return {Promise<LH.Artifacts['ConsoleMessages']>}
     */
    getArtifact(): Promise<LH.Artifacts['ConsoleMessages']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=console-messages.d.ts.map