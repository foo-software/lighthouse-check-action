import { NumberFormatInternal } from '../types/number';
/**
 * https://tc39.es/ecma402/#sec-formatnumericrange
 */
export declare function FormatNumericRange(numberFormat: Intl.NumberFormat, x: number, y: number, { getInternalSlots, }: {
    getInternalSlots(nf: Intl.NumberFormat): NumberFormatInternal;
}): string;
