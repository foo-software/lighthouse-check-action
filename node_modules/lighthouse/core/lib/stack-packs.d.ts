/**
 * Returns all packs that match the stacks found in the page.
 * @param {LH.Artifacts['Stacks']|undefined} pageStacks
 * @return {LH.RawIcu<Array<LH.Result.StackPack>>}
 */
export function getStackPacks(pageStacks: LH.Artifacts['Stacks'] | undefined): LH.RawIcu<Array<LH.Result.StackPack>>;
/**
 * Pairs consisting of a stack pack's ID and the set of stacks needed to be
 * detected in a page to display that pack's advice.
 * @type {Array<{packId: string, requiredStacks: Array<string>}>}
 */
export const stackPacksToInclude: Array<{
    packId: string;
    requiredStacks: Array<string>;
}>;
//# sourceMappingURL=stack-packs.d.ts.map