export type NetworkMonitor = InstanceType<typeof import("./network-monitor.js")['NetworkMonitor']>;
export type NetworkMonitorEvent = import('./network-monitor.js').NetworkMonitorEvent;
export type CancellableWait<T = void> = {
    promise: Promise<T>;
    cancel: () => void;
};
export type WaitOptions = {
    pauseAfterFcpMs: number;
    pauseAfterLoadMs: number;
    networkQuietThresholdMs: number;
    cpuQuietThresholdMs: number;
    maxWaitForLoadedMs: number;
    maxWaitForFcpMs: number | undefined;
    _waitForTestOverrides?: {
        waitForFcp: typeof waitForFcp;
        waitForLoadEvent: typeof waitForLoadEvent;
        waitForNetworkIdle: typeof waitForNetworkIdle;
        waitForCPUIdle: typeof waitForCPUIdle;
    } | undefined;
};
/** @typedef {InstanceType<import('./network-monitor.js')['NetworkMonitor']>} NetworkMonitor */
/** @typedef {import('./network-monitor.js').NetworkMonitorEvent} NetworkMonitorEvent */
/**
 * @template [T=void]
 * @typedef CancellableWait
 * @prop {Promise<T>} promise
 * @prop {() => void} cancel
 */
/**
 * @typedef WaitOptions
 * @prop {number} pauseAfterFcpMs
 * @prop {number} pauseAfterLoadMs
 * @prop {number} networkQuietThresholdMs
 * @prop {number} cpuQuietThresholdMs
 * @prop {number} maxWaitForLoadedMs
 * @prop {number|undefined} maxWaitForFcpMs
 * @prop {{waitForFcp: typeof waitForFcp, waitForLoadEvent: typeof waitForLoadEvent, waitForNetworkIdle: typeof waitForNetworkIdle, waitForCPUIdle: typeof waitForCPUIdle}} [_waitForTestOverrides]
 */
/**
 * Returns a promise that resolves immediately.
 * Used for placeholder conditions that we don't want to start waiting for just yet, but still want
 * to satisfy the same interface.
 * @return {{promise: Promise<void>, cancel: function(): void}}
 */
export function waitForNothing(): {
    promise: Promise<void>;
    cancel: () => void;
};
/**
 * Returns a promise that resolve when a frame has been navigated.
 * Used for detecting that our about:blank reset has been completed.
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {CancellableWait<LH.Crdp.Page.FrameNavigatedEvent>}
 */
export function waitForFrameNavigated(session: LH.Gatherer.ProtocolSession): CancellableWait<LH.Crdp.Page.FrameNavigatedEvent>;
/**
 * Returns a promise that resolve when a frame has a FCP.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {number} pauseAfterFcpMs
 * @param {number} maxWaitForFcpMs
 * @return {CancellableWait}
 */
export function waitForFcp(session: LH.Gatherer.ProtocolSession, pauseAfterFcpMs: number, maxWaitForFcpMs: number): CancellableWait;
/**
 * Return a promise that resolves `pauseAfterLoadMs` after the load event
 * fires and a method to cancel internal listeners and timeout.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {number} pauseAfterLoadMs
 * @return {CancellableWait}
 */
export function waitForLoadEvent(session: LH.Gatherer.ProtocolSession, pauseAfterLoadMs: number): CancellableWait;
/**
 * Returns a promise that resolves when the network has been idle (after DCL) for
 * `networkQuietThresholdMs` ms and a method to cancel internal network listeners/timeout.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {NetworkMonitor} networkMonitor
 * @param {{networkQuietThresholdMs: number, busyEvent: NetworkMonitorEvent, idleEvent: NetworkMonitorEvent, isIdle(recorder: NetworkMonitor): boolean, pretendDCLAlreadyFired?: boolean}} networkQuietOptions
 * @return {CancellableWait}
 */
export function waitForNetworkIdle(session: LH.Gatherer.ProtocolSession, networkMonitor: NetworkMonitor, networkQuietOptions: {
    networkQuietThresholdMs: number;
    busyEvent: NetworkMonitorEvent;
    idleEvent: NetworkMonitorEvent;
    isIdle(recorder: NetworkMonitor): boolean;
    pretendDCLAlreadyFired?: boolean | undefined;
}): CancellableWait;
/**
 * Resolves when there have been no long tasks for at least waitForCPUQuiet ms.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {number} waitForCPUQuiet
 * @return {CancellableWait}
 */
export function waitForCPUIdle(session: LH.Gatherer.ProtocolSession, waitForCPUQuiet: number): CancellableWait;
/**
 * Returns a promise that resolves when:
 * - All of the following conditions have been met:
 *    - page has no security issues
 *    - pauseAfterLoadMs milliseconds have passed since the load event.
 *    - networkQuietThresholdMs milliseconds have passed since the last network request that exceeded
 *      2 inflight requests (network-2-quiet has been reached).
 *    - cpuQuietThresholdMs have passed since the last long task after network-2-quiet.
 * - maxWaitForLoadedMs milliseconds have passed.
 * See https://github.com/GoogleChrome/lighthouse/issues/627 for more.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {NetworkMonitor} networkMonitor
 * @param {WaitOptions} options
 * @return {Promise<{timedOut: boolean}>}
 */
export function waitForFullyLoaded(session: LH.Gatherer.ProtocolSession, networkMonitor: NetworkMonitor, options: WaitOptions): Promise<{
    timedOut: boolean;
}>;
/**
 * @param {LH.Gatherer.Driver} driver
 */
export function waitForUserToContinue(driver: LH.Gatherer.Driver): Promise<void>;
//# sourceMappingURL=wait-for-condition.d.ts.map