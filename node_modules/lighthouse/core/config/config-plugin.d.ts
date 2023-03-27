export default ConfigPlugin;
/**
 * A set of methods for extracting and validating a Lighthouse plugin config.
 */
declare class ConfigPlugin {
    /**
     * Extract and validate the list of AuditDefns added by the plugin (or undefined
     * if no additional audits are being added by the plugin).
     * @param {unknown} auditsJson
     * @param {string} pluginName
     * @return {Array<{path: string}>|undefined}
     */
    static _parseAuditsList(auditsJson: unknown, pluginName: string): Array<{
        path: string;
    }> | undefined;
    /**
     * Extract and validate the list of category AuditRefs added by the plugin.
     * @param {unknown} auditRefsJson
     * @param {string} pluginName
     * @return {Array<LH.Config.AuditRefJson>}
     */
    static _parseAuditRefsList(auditRefsJson: unknown, pluginName: string): Array<LH.Config.AuditRefJson>;
    /**
     * Extract and validate the category added by the plugin.
     * @param {unknown} categoryJson
     * @param {string} pluginName
     * @return {LH.Config.CategoryJson}
     */
    static _parseCategory(categoryJson: unknown, pluginName: string): LH.Config.CategoryJson;
    /**
     * Extract and validate groups JSON added by the plugin.
     * @param {unknown} groupsJson
     * @param {string} pluginName
     * @return {Record<string, LH.Config.GroupJson>|undefined}
     */
    static _parseGroups(groupsJson: unknown, pluginName: string): Record<string, LH.Config.GroupJson> | undefined;
    /**
     * Extracts and validates a config from the provided plugin input, throwing
     * if it deviates from the expected object shape.
     * @param {unknown} pluginJson
     * @param {string} pluginName
     * @return {LH.Config}
     */
    static parsePlugin(pluginJson: unknown, pluginName: string): LH.Config;
}
//# sourceMappingURL=config-plugin.d.ts.map