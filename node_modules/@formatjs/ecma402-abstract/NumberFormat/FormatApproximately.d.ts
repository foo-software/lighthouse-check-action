import { NumberFormatInternal, NumberFormatPart } from '../types/number';
/**
 * https://tc39.es/ecma402/#sec-formatapproximately
 */
export declare function FormatApproximately(numberFormat: Intl.NumberFormat, result: NumberFormatPart[], { getInternalSlots, }: {
    getInternalSlots(nf: Intl.NumberFormat): NumberFormatInternal;
}): NumberFormatPart[];
