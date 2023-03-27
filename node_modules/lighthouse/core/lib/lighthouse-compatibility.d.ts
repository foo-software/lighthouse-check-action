export type ItemValueType = import('../../types/lhr/audit-details').default.ItemValueType;
/** @typedef {import('../../types/lhr/audit-details').default.ItemValueType} ItemValueType */
/**
 * Upgrades an lhr object in-place to account for changes in the data structure over major versions.
 * @param {LH.Result} lhr
 */
export function upgradeLhrForCompatibility(lhr: LH.Result): void;
//# sourceMappingURL=lighthouse-compatibility.d.ts.map