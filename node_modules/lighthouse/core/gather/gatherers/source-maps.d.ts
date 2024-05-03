export default SourceMaps;
/**
 * @fileoverview Gets JavaScript source maps.
 */
declare class SourceMaps extends BaseGatherer {
    /** @type {LH.Gatherer.GathererMeta<'Scripts'>} */
    meta: LH.Gatherer.GathererMeta<'Scripts'>;
    /**
     * @param {LH.Gatherer.Driver} driver
     * @param {string} sourceMapUrl
     * @return {Promise<LH.Artifacts.RawSourceMap>}
     */
    fetchSourceMap(driver: LH.Gatherer.Driver, sourceMapUrl: string): Promise<LH.Artifacts.RawSourceMap>;
    /**
     * @param {string} sourceMapURL
     * @return {LH.Artifacts.RawSourceMap}
     */
    parseSourceMapFromDataUrl(sourceMapURL: string): LH.Artifacts.RawSourceMap;
    /**
     * @param {string} url
     * @param {string} base
     * @return {string|undefined}
     */
    _resolveUrl(url: string, base: string): string | undefined;
    /**
     * @param {LH.Gatherer.Driver} driver
     * @param {LH.Artifacts.Script} script
     * @return {Promise<LH.Artifacts.SourceMap>}
     */
    _retrieveMapFromScript(driver: LH.Gatherer.Driver, script: LH.Artifacts.Script): Promise<LH.Artifacts.SourceMap>;
    /**
     * @param {LH.Gatherer.Context<'Scripts'>} context
     * @return {Promise<LH.Artifacts['SourceMaps']>}
     */
    getArtifact(context: LH.Gatherer.Context<'Scripts'>): Promise<LH.Artifacts['SourceMaps']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=source-maps.d.ts.map