/**
 * Prepares a target for observational analysis by setting throttling and network headers/blocked patterns.
 *
 * This method assumes `prepareTargetForNavigationMode` or `prepareTargetForTimespanMode` has already been invoked.
 *
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {LH.Config.Settings} settings
 */
export function prepareThrottlingAndNetwork(session: LH.Gatherer.ProtocolSession, settings: LH.Config.Settings): Promise<void>;
/**
 * Prepares a target to be analyzed in timespan mode by enabling protocol domains, emulation, and throttling.
 *
 * @param {LH.Gatherer.Driver} driver
 * @param {LH.Config.Settings} settings
 */
export function prepareTargetForTimespanMode(driver: LH.Gatherer.Driver, settings: LH.Config.Settings): Promise<void>;
/**
 * Prepares a target to be analyzed in navigation mode by enabling protocol domains, emulation, and new document
 * handlers for global APIs or error handling.
 *
 * This method should be used in combination with `prepareTargetForIndividualNavigation` before a specific navigation occurs.
 *
 * @param {LH.Gatherer.Driver} driver
 * @param {LH.Config.Settings} settings
 * @param {LH.NavigationRequestor} requestor
 * @return {Promise<{warnings: Array<LH.IcuMessage>}>}
 */
export function prepareTargetForNavigationMode(driver: LH.Gatherer.Driver, settings: LH.Config.Settings, requestor: LH.NavigationRequestor): Promise<{
    warnings: Array<LH.IcuMessage>;
}>;
/**
 * Enables `Debugger` domain to receive async stacktrace information on network request initiators.
 * This is critical for tracking attribution of tasks and performance simulation accuracy.
 * @param {LH.Gatherer.ProtocolSession} session
 */
export function enableAsyncStacks(session: LH.Gatherer.ProtocolSession): Promise<() => Promise<void>>;
//# sourceMappingURL=prepare.d.ts.map