export type GathererConstructor = typeof import('../gather/base-gatherer.js').default;
export type Audit = typeof import('../audits/audit.js')['Audit'];
export type Gatherer = InstanceType<GathererConstructor>;
/**
 * // TODO(bckenny): could adopt "jsonified" type to ensure T will survive JSON
 * round trip: https://github.com/Microsoft/TypeScript/issues/21838
 * @template T
 * @param {T} json
 * @return {T}
 */
export function deepClone<T>(json: T): T;
/**
 * Deep clone a config, copying over any "live" gatherer or audit that
 * wouldn't make the JSON round trip.
 * @param {LH.Config} json
 * @return {LH.Config}
 */
export function deepCloneConfigJson(json: LH.Config): LH.Config;
/**
 * Until support of jsdoc templates with constraints, type in config.d.ts.
 * See https://github.com/Microsoft/TypeScript/issues/24283
 * @type {LH.Config.Merge}
 */
export const mergeConfigFragment: LH.Config.Merge;
/**
 * Merge an array of items by a caller-defined key. `mergeConfigFragment` is used to merge any items
 * with a matching key.
 *
 * @template {Record<string, any>} T
 * @param {Array<T>|null|undefined} baseArray
 * @param {Array<T>|null|undefined} extensionArray
 * @param {(item: T) => string} keyFn
 * @return {Array<T>}
 */
export function mergeConfigFragmentArrayByKey<T extends Record<string, any>>(baseArray: T[] | null | undefined, extensionArray: T[] | null | undefined, keyFn: (item: T) => string): T[];
/**
 * If any items with identical `path` properties are found in the input array,
 * merge their `options` properties into the first instance and then discard any
 * other instances.
 * @template {{path?: string, options: Record<string, unknown>}} T
 * @param {T[]} items
 * @return T[]
 */
export function mergeOptionsOfItems<T extends {
    path?: string | undefined;
    options: Record<string, unknown>;
}>(items: T[]): T[];
/**
 * @param {LH.Config} config
 * @param {string | undefined} configDir
 * @param {{plugins?: string[]} | undefined} flags
 * @return {Promise<LH.Config>}
 */
export function mergePlugins(config: LH.Config, configDir: string | undefined, flags: {
    plugins?: string[];
} | undefined): Promise<LH.Config>;
/**
 * Take an array of audits and audit paths and require any paths (possibly
 * relative to the optional `configDir`) using `resolveModule`,
 * leaving only an array of AuditDefns.
 * @param {LH.Config['audits']} audits
 * @param {string=} configDir
 * @return {Promise<Array<LH.Config.AuditDefn>|null>}
 */
export function resolveAuditsToDefns(audits: LH.Config['audits'], configDir?: string | undefined): Promise<Array<LH.Config.AuditDefn> | null>;
/**
 * Turns a GathererJson into a GathererDefn which involves a few main steps:
 *    - Expanding the JSON shorthand the full definition format.
 *    - `require`ing in the implementation.
 *    - Creating a gatherer instance from the implementation.
 * @param {LH.Config.GathererJson} gathererJson
 * @param {Array<string>} coreGathererList
 * @param {string=} configDir
 * @return {Promise<LH.Config.AnyGathererDefn>}
 */
export function resolveGathererToDefn(gathererJson: LH.Config.GathererJson, coreGathererList: Array<string>, configDir?: string | undefined): Promise<LH.Config.AnyGathererDefn>;
/**
 * Resolves the location of the specified module and returns an absolute
 * string path to the file. Used for loading custom audits and gatherers.
 * Throws an error if no module is found.
 * @param {string} moduleIdentifier
 * @param {string=} configDir The absolute path to the directory of the config file, if there is one.
 * @param {string=} category Optional plugin category (e.g. 'audit') for better error messages.
 * @return {string}
 * @throws {Error}
 */
export function resolveModulePath(moduleIdentifier: string, configDir?: string | undefined, category?: string | undefined): string;
/**
 * @param {LH.SharedFlagsSettings} settingsJson
 * @param {LH.Flags|undefined} overrides
 * @return {LH.Config.Settings}
 */
export function resolveSettings(settingsJson?: LH.SharedFlagsSettings, overrides?: LH.Flags | undefined): LH.Config.Settings;
//# sourceMappingURL=config-helpers.d.ts.map