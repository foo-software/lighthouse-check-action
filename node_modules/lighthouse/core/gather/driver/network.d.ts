/**
 * Return the body of the response with the given ID. Rejects if getting the
 * body times out.
 * @param {LH.Gatherer.ProtocolSession} session
 * @param {string} requestId
 * @param {number} [timeout]
 * @return {Promise<string>}
 */
export function fetchResponseBodyFromCache(session: LH.Gatherer.ProtocolSession, requestId: string, timeout?: number | undefined): Promise<string>;
//# sourceMappingURL=network.d.ts.map