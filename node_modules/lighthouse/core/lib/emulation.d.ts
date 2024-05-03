/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
export function emulate(session: LH.Gatherer.ProtocolSession, settings: LH.Config.Settings): Promise<void>;
/**
 * Sets the throttling options specified in config settings, clearing existing network throttling if
 * throttlingMethod is not `devtools` (but not CPU throttling, suspected requirement of WPT-compat).
 *
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {LH.Config.Settings} settings
 * @return {Promise<void>}
 */
export function throttle(session: LH.Gatherer.ProtocolSession, settings: LH.Config.Settings): Promise<void>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {Promise<void>}
 */
export function clearThrottling(session: LH.Gatherer.ProtocolSession): Promise<void>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
export function enableNetworkThrottling(session: LH.Gatherer.ProtocolSession, throttlingSettings: Required<LH.ThrottlingSettings>): Promise<void>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {Promise<void>}
 */
export function clearNetworkThrottling(session: LH.Gatherer.ProtocolSession): Promise<void>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {Required<LH.ThrottlingSettings>} throttlingSettings
 * @return {Promise<void>}
 */
export function enableCPUThrottling(session: LH.Gatherer.ProtocolSession, throttlingSettings: Required<LH.ThrottlingSettings>): Promise<void>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {Promise<void>}
 */
export function clearCPUThrottling(session: LH.Gatherer.ProtocolSession): Promise<void>;
//# sourceMappingURL=emulation.d.ts.map