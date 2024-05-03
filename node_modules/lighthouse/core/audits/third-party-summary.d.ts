export default ThirdPartySummary;
export type Summary = {
    mainThreadTime: number;
    transferSize: number;
    blockingTime: number;
    tbtImpact: number;
};
export type URLSummary = {
    transferSize: number;
    blockingTime: number;
    tbtImpact: number;
    url: string | LH.IcuMessage;
};
export type SummaryMaps = {
    /**
     * Map of impact summaries for each entity.
     */
    byEntity: Map<LH.Artifacts.Entity, Summary>;
    /**
     * Map of impact summaries for each URL.
     */
    byURL: Map<string, Summary>;
    /**
     * Map of URLs under each entity.
     */
    urls: Map<LH.Artifacts.Entity, string[]>;
};
/**
 * @typedef Summary
 * @property {number} mainThreadTime
 * @property {number} transferSize
 * @property {number} blockingTime
 * @property {number} tbtImpact
 */
/**
 * @typedef URLSummary
 * @property {number} transferSize
 * @property {number} blockingTime
 * @property {number} tbtImpact
 * @property {string | LH.IcuMessage} url
 */
/** @typedef SummaryMaps
 * @property {Map<LH.Artifacts.Entity, Summary>} byEntity Map of impact summaries for each entity.
 * @property {Map<string, Summary>} byURL Map of impact summaries for each URL.
 * @property {Map<LH.Artifacts.Entity, string[]>} urls Map of URLs under each entity.
 */
declare class ThirdPartySummary extends Audit {
    /**
     *
     * @param {Array<LH.Artifacts.NetworkRequest>} networkRecords
     * @param {Array<LH.Artifacts.TBTImpactTask>} tbtImpactTasks
     * @param {number} cpuMultiplier
     * @param {LH.Artifacts.EntityClassification} entityClassification
     * @return {SummaryMaps}
     */
    static getSummaries(networkRecords: Array<LH.Artifacts.NetworkRequest>, tbtImpactTasks: Array<LH.Artifacts.TBTImpactTask>, cpuMultiplier: number, entityClassification: LH.Artifacts.EntityClassification): SummaryMaps;
    /**
     * @param {LH.Artifacts.Entity} entity
     * @param {SummaryMaps} summaries
     * @return {Array<URLSummary>}
     */
    static makeSubItems(entity: LH.Artifacts.Entity, summaries: SummaryMaps): Array<URLSummary>;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Audit.Context} context
     * @return {Promise<LH.Audit.Product>}
     */
    static audit(artifacts: LH.Artifacts, context: LH.Audit.Context): Promise<LH.Audit.Product>;
}
export namespace UIStrings {
    const title: string;
    const failureTitle: string;
    const description: string;
    const columnThirdParty: string;
    const displayValue: string;
}
import { Audit } from './audit.js';
import { EntityClassification } from '../computed/entity-classification.js';
//# sourceMappingURL=third-party-summary.d.ts.map