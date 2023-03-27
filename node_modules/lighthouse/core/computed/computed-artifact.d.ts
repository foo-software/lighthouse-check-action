/**
 * Decorate computableArtifact with a caching `request()` method which will
 * automatically call `computableArtifact.compute_()` under the hood.
 * @template {{name: string, compute_(dependencies: unknown, context: LH.Artifacts.ComputedContext): Promise<unknown>}} C
 * @template {Array<keyof LH.Util.FirstParamType<C['compute_']>>} K
 * @param {C} computableArtifact
 * @param {(K & ([keyof LH.Util.FirstParamType<C['compute_']>] extends [K[number]] ? unknown : never)) | null} keys List of properties of `dependencies` used by `compute_`; other properties are filtered out. Use `null` to allow all properties. Ensures that only required properties are used for caching result.
 */
export function makeComputedArtifact<C extends {
    name: string;
    compute_(dependencies: unknown, context: LH.Artifacts.ComputedContext): Promise<unknown>;
}, K extends (keyof import("../../types/utility-types.js").default.FirstParamType<C["compute_"]>)[]>(computableArtifact: C, keys: (K & ([keyof import("../../types/utility-types.js").default.FirstParamType<C["compute_"]>] extends [K[number]] ? unknown : never)) | null): C & {
    request: (dependencies: import("../../types/utility-types.js").default.FirstParamType<C["compute_"]>, context: LH.Artifacts.ComputedContext) => ReturnType<C["compute_"]>;
};
//# sourceMappingURL=computed-artifact.d.ts.map