/**
 * @fileoverview Helper functions to transform an LHR into a proto-ready LHR.
 *
 * FIXME: This file is 100% technical debt.  Our eventual goal is for the
 * roundtrip JSON to match the Golden LHR 1:1.
 */
/**
 * Transform an LHR into a proto-friendly, mostly-compatible LHR.
 * @param {LH.Result} lhr
 * @return {LH.Result}
 */
export function processForProto(lhr: LH.Result): LH.Result;
//# sourceMappingURL=proto-preprocessor.d.ts.map