export default Stacks;
export type JSLibraryDetectorTestResult = false | {
    version: string | number | null;
};
export type JSLibraryDetectorTest = {
    id: string;
    icon: string;
    url: string;
    /**
     * npm module name, if applicable to library.
     */
    npm: string | null;
    /**
     * Returns false if library is not present, otherwise returns an object that contains the library version (set to null if the version is not detected).
     */
    test: (arg0: Window) => JSLibraryDetectorTestResult | Promise<JSLibraryDetectorTestResult>;
};
export type JSLibrary = {
    id: string;
    name: string;
    version: string | number | null;
    npm: string | null;
};
/** @implements {LH.Gatherer.GathererInstance} */
declare class Stacks extends BaseGatherer implements LH.Gatherer.GathererInstance {
    /**
     * @param {LH.Gatherer.Driver['executionContext']} executionContext
     * @return {Promise<LH.Artifacts['Stacks']>}
     */
    static collectStacks(executionContext: LH.Gatherer.Driver['executionContext']): Promise<LH.Artifacts['Stacks']>;
    /**
     * @param {LH.Gatherer.Context} context
     * @return {Promise<LH.Artifacts['Stacks']>}
     */
    getArtifact(context: LH.Gatherer.Context): Promise<LH.Artifacts['Stacks']>;
}
import BaseGatherer from '../base-gatherer.js';
//# sourceMappingURL=stacks.d.ts.map