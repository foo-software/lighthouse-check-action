export default InspectorIssues;
declare class InspectorIssues extends BaseGatherer {
    /** @type {LH.Gatherer.GathererMeta<'DevtoolsLog'>} */
    meta: LH.Gatherer.GathererMeta<'DevtoolsLog'>;
    /** @type {Array<LH.Crdp.Audits.InspectorIssue>} */
    _issues: Array<LH.Crdp.Audits.InspectorIssue>;
    _onIssueAdded: (entry: LH.Crdp.Audits.IssueAddedEvent) => void;
    /**
     * @param {LH.Crdp.Audits.IssueAddedEvent} entry
     */
    onIssueAdded(entry: LH.Crdp.Audits.IssueAddedEvent): void;
    /**
     * @param {LH.Gatherer.Context} context
     */
    startInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context} context
     */
    stopInstrumentation(context: LH.Gatherer.Context): Promise<void>;
    /**
     * @param {LH.Gatherer.Context<'DevtoolsLog'>} context
     * @return {Promise<LH.Artifacts['InspectorIssues']>}
     */
    getArtifact(context: LH.Gatherer.Context<'DevtoolsLog'>): Promise<LH.Artifacts['InspectorIssues']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=inspector-issues.d.ts.map