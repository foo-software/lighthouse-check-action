export namespace UIStrings {
    const warningSlowHostCpu: string;
}
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {Promise<LH.Crdp.Browser.GetVersionResponse & {milestone: number}>}
 */
export function getBrowserVersion(session: LH.Gatherer.ProtocolSession): Promise<import("devtools-protocol").Protocol.Browser.GetVersionResponse & {
    milestone: number;
}>;
/**
 * Computes the benchmark index to get a rough estimate of device class.
 * @param {LH.Gatherer.Driver['executionContext']} executionContext
 * @return {Promise<number>}
 */
export function getBenchmarkIndex(executionContext: LH.Gatherer.Driver['executionContext']): Promise<number>;
/**
 * Returns a warning if the host device appeared to be underpowered according to BenchmarkIndex.
 *
 * @param {{settings: LH.Config.Settings; baseArtifacts: Pick<LH.Artifacts, 'BenchmarkIndex'>}} context
 * @return {LH.IcuMessage | undefined}
 */
export function getSlowHostCpuWarning(context: {
    settings: LH.Config.Settings;
    baseArtifacts: Pick<LH.Artifacts, 'BenchmarkIndex'>;
}): LH.IcuMessage | undefined;
/**
 * @param {{settings: LH.Config.Settings, baseArtifacts: Pick<LH.Artifacts, 'BenchmarkIndex'>}} context
 * @return {Array<LH.IcuMessage>}
 */
export function getEnvironmentWarnings(context: {
    settings: LH.Config.Settings;
    baseArtifacts: Pick<LH.Artifacts, 'BenchmarkIndex'>;
}): Array<LH.IcuMessage>;
//# sourceMappingURL=environment.d.ts.map