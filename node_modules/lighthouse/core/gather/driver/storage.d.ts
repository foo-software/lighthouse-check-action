/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {string} url
 * @param {LH.Config.Settings['clearStorageTypes']} clearStorageTypes
 * @return {Promise<LH.IcuMessage[]>}
 */
export function clearDataForOrigin(session: LH.Gatherer.ProtocolSession, url: string, clearStorageTypes: LH.Config.Settings['clearStorageTypes']): Promise<LH.IcuMessage[]>;
/**
 * Clear the network cache on disk and in memory.
 * @param {LH.Gatherer.ProtocolSession} session
 * @return {Promise<LH.IcuMessage[]>}
 */
export function clearBrowserCaches(session: LH.Gatherer.ProtocolSession): Promise<LH.IcuMessage[]>;
/**
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {string} url
 * @return {Promise<LH.IcuMessage | undefined>}
 */
export function getImportantStorageWarning(session: LH.Gatherer.ProtocolSession, url: string): Promise<LH.IcuMessage | undefined>;
export namespace UIStrings {
    const warningData: string;
    const warningCacheTimeout: string;
    const warningOriginDataTimeout: string;
}
//# sourceMappingURL=storage.d.ts.map