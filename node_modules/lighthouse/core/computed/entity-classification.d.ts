export { EntityClassificationComputed as EntityClassification };
export type EntityCache = Map<string, LH.Artifacts.Entity>;
declare const EntityClassificationComputed: typeof EntityClassification & {
    request: (dependencies: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: import("../../types/utility-types.js").default.ImmutableObject<{
        computedCache: Map<string, import("../lib/arbitrary-equality-map.js").ArbitraryEqualityMap>;
    }>) => Promise<import("../index.js").Artifacts.EntityClassification>;
};
/** @typedef {Map<string, LH.Artifacts.Entity>} EntityCache */
declare class EntityClassification {
    /**
     * @param {EntityCache} entityCache
     * @param {string} url
     * @param {string=} extensionName
     * @return {LH.Artifacts.Entity}
     */
    static makeupChromeExtensionEntity_(entityCache: EntityCache, url: string, extensionName?: string | undefined): LH.Artifacts.Entity;
    /**
     * @param {EntityCache} entityCache
     * @param {string} url
     * @return {LH.Artifacts.Entity | undefined}
     */
    static _makeUpAnEntity(entityCache: EntityCache, url: string): LH.Artifacts.Entity | undefined;
    /**
     * Preload Chrome extensions found in the devtoolsLog into cache.
     * @param {EntityCache} entityCache
     * @param {LH.DevtoolsLog} devtoolsLog
     */
    static _preloadChromeExtensionsToCache(entityCache: EntityCache, devtoolsLog: import("../index.js").DevtoolsLog): void;
    /**
     * @param {{URL: LH.Artifacts['URL'], devtoolsLog: LH.DevtoolsLog}} data
     * @param {LH.Artifacts.ComputedContext} context
     * @return {Promise<LH.Artifacts.EntityClassification>}
     */
    static compute_(data: {
        URL: LH.Artifacts['URL'];
        devtoolsLog: import("../index.js").DevtoolsLog;
    }, context: LH.Artifacts.ComputedContext): Promise<LH.Artifacts.EntityClassification>;
}
//# sourceMappingURL=entity-classification.d.ts.map