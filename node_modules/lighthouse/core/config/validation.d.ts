/**
 * Determines if the artifact dependency direction is valid. The dependency's minimum supported mode
 * must be less than or equal to the dependent's.
 *
 * @param {LH.Config.AnyGathererDefn} dependent The artifact that depends on the other.
 * @param {LH.Config.AnyGathererDefn} dependency The artifact that is being depended on by the other.
 * @return {boolean}
 */
export function isValidArtifactDependency(dependent: LH.Config.AnyGathererDefn, dependency: LH.Config.AnyGathererDefn): boolean;
/**
 * Throws if pluginName is invalid or (somehow) collides with a category in the
 * config being added to.
 * @param {LH.Config} config
 * @param {string} pluginName
 */
export function assertValidPluginName(config: LH.Config, pluginName: string): void;
/**
 * Throws an error if the provided object does not implement the required gatherer interface.
 * @param {LH.Config.AnyArtifactDefn} artifactDefn
 */
export function assertValidArtifact(artifactDefn: LH.Config.AnyArtifactDefn): void;
/**
 * Throws an error if the provided object does not implement the required properties of an audit
 * definition.
 * @param {LH.Config.AuditDefn} auditDefinition
 */
export function assertValidAudit(auditDefinition: LH.Config.AuditDefn): void;
/**
 * @param {LH.Config.ResolvedConfig['categories']} categories
 * @param {LH.Config.ResolvedConfig['audits']} audits
 * @param {LH.Config.ResolvedConfig['groups']} groups
 */
export function assertValidCategories(categories: LH.Config.ResolvedConfig['categories'], audits: LH.Config.ResolvedConfig['audits'], groups: LH.Config.ResolvedConfig['groups']): void;
/**
 * Validate the settings after they've been built.
 * @param {LH.Config.Settings} settings
 */
export function assertValidSettings(settings: LH.Config.Settings): void;
/**
 * Asserts that artifacts are unique, valid and are in a dependency order that can be computed.
 *
 * @param {Array<LH.Config.AnyArtifactDefn>} artifactDefns
 */
export function assertValidArtifacts(artifactDefns: Array<LH.Config.AnyArtifactDefn>): void;
/**
 * @param {LH.Config.ResolvedConfig} resolvedConfig
 */
export function assertValidConfig(resolvedConfig: LH.Config.ResolvedConfig): void;
/**
 * @param {string} artifactId
 * @param {string} dependencyKey
 * @return {never}
 */
export function throwInvalidDependencyOrder(artifactId: string, dependencyKey: string): never;
/**
 * @param {string} artifactId
 * @param {string} dependencyKey
 * @return {never}
 */
export function throwInvalidArtifactDependency(artifactId: string, dependencyKey: string): never;
//# sourceMappingURL=validation.d.ts.map