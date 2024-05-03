export type ArbitraryEqualityMap = import('./lib/arbitrary-equality-map.js').ArbitraryEqualityMap;
/** @typedef {import('./lib/arbitrary-equality-map.js').ArbitraryEqualityMap} ArbitraryEqualityMap */
export class Runner {
    /**
     * @param {LH.Artifacts} artifacts
     * @param {{resolvedConfig: LH.Config.ResolvedConfig, computedCache: Map<string, ArbitraryEqualityMap>}} options
     * @return {Promise<LH.RunnerResult|undefined>}
     */
    static audit(artifacts: LH.Artifacts, options: {
        resolvedConfig: LH.Config.ResolvedConfig;
        computedCache: Map<string, ArbitraryEqualityMap>;
    }): Promise<LH.RunnerResult | undefined>;
    /**
     * @param {LH.Artifacts} artifacts
     * @param {LH.Artifacts.ComputedContext} context
     */
    static getEntityClassification(artifacts: LH.Artifacts, context: LH.Artifacts.ComputedContext): Promise<import("../types/lhr/lhr.js").default.LhrEntity[] | undefined>;
    /**
     * User can run -G solo, -A solo, or -GA together
     * -G and -A will run partial lighthouse pipelines,
     * and -GA will run everything plus save artifacts and lhr to disk.
     *
     * @param {(runnerData: {resolvedConfig: LH.Config.ResolvedConfig}) => Promise<LH.Artifacts>} gatherFn
     * @param {{resolvedConfig: LH.Config.ResolvedConfig, computedCache: Map<string, ArbitraryEqualityMap>}} options
     * @return {Promise<LH.Artifacts>}
     */
    static gather(gatherFn: (runnerData: {
        resolvedConfig: LH.Config.ResolvedConfig;
    }) => Promise<LH.Artifacts>, options: {
        resolvedConfig: LH.Config.ResolvedConfig;
        computedCache: Map<string, ArbitraryEqualityMap>;
    }): Promise<LH.Artifacts>;
    /**
     * @param {any} err
     * @param {LH.Config.Settings} settings
     */
    static createRunnerError(err: any, settings: LH.Config.Settings): any;
    /**
     * This handles both the auditMode case where gatherer entries need to be merged in and
     * the gather/audit case where timingEntriesFromRunner contains all entries from this run,
     * including those also in timingEntriesFromArtifacts.
     * @param {LH.Artifacts} artifacts
     * @return {LH.Result.Timing}
     */
    static _getTiming(artifacts: LH.Artifacts): LH.Result.Timing;
    /**
     * Run all audits with specified settings and artifacts.
     * @param {LH.Config.Settings} settings
     * @param {Array<LH.Config.AuditDefn>} audits
     * @param {LH.Artifacts} artifacts
     * @param {Array<string | LH.IcuMessage>} runWarnings
     * @param {Map<string, ArbitraryEqualityMap>} computedCache
     * @return {Promise<Record<string, LH.RawIcu<LH.Audit.Result>>>}
     */
    static _runAudits(settings: LH.Config.Settings, audits: Array<LH.Config.AuditDefn>, artifacts: LH.Artifacts, runWarnings: Array<string | LH.IcuMessage>, computedCache: Map<string, ArbitraryEqualityMap>): Promise<Record<string, LH.RawIcu<LH.Audit.Result>>>;
    /**
     * Checks that the audit's required artifacts exist and runs the audit if so.
     * Otherwise returns error audit result.
     * @param {LH.Config.AuditDefn} auditDefn
     * @param {LH.Artifacts} artifacts
     * @param {Pick<LH.Audit.Context, 'settings'|'computedCache'>} sharedAuditContext
     * @param {Array<string | LH.IcuMessage>} runWarnings
     * @return {Promise<LH.RawIcu<LH.Audit.Result>>}
     * @private
     */
    private static _runAudit;
    /**
     * Searches a pass's artifacts for any `lhrRuntimeError` error artifacts.
     * Returns the first one found or `null` if none found.
     * @param {LH.Artifacts} artifacts
     * @return {LH.RawIcu<LH.Result['runtimeError']>|undefined}
     */
    static getArtifactRuntimeError(artifacts: LH.Artifacts): LH.RawIcu<LH.Result['runtimeError']> | undefined;
    /**
     * Returns list of audit names for external querying.
     * @return {Array<string>}
     */
    static getAuditList(): Array<string>;
    /**
     * Returns list of gatherer names for external querying.
     * @return {Array<string>}
     */
    static getGathererList(): Array<string>;
    /**
     * Get path to use for -G and -A modes. Defaults to $CWD/latest-run
     * @param {LH.Config.Settings} settings
     * @return {string}
     */
    static _getDataSavePath(settings: LH.Config.Settings): string;
}
import { Audit } from './audits/audit.js';
//# sourceMappingURL=runner.d.ts.map