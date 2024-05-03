/**
 * @param {LH.Config.ResolvedConfig} resolvedConfig
 * @param {LH.Gatherer.Driver} driver
 * @param {{gatherMode: LH.Gatherer.GatherMode}} context
 * @return {Promise<LH.BaseArtifacts>}
 */
export function getBaseArtifacts(resolvedConfig: LH.Config.ResolvedConfig, driver: LH.Gatherer.Driver, context: {
    gatherMode: LH.Gatherer.GatherMode;
}): Promise<LH.BaseArtifacts>;
/**
 * @param {LH.BaseArtifacts} baseArtifacts
 * @param {Partial<LH.GathererArtifacts>} gathererArtifacts
 * @return {LH.Artifacts}
 */
export function finalizeArtifacts(baseArtifacts: LH.BaseArtifacts, gathererArtifacts: Partial<LH.GathererArtifacts>): LH.Artifacts;
//# sourceMappingURL=base-artifacts.d.ts.map