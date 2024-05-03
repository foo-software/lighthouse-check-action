import { NumberFormatInternal, NumberRangeToParts } from '../types/number';
/**
 * https://tc39.es/ecma402/#sec-formatnumericrangetoparts
 */
export declare function FormatNumericRangeToParts(numberFormat: Intl.NumberFormat, x: number, y: number, { getInternalSlots, }: {
    getInternalSlots(nf: Intl.NumberFormat): NumberFormatInternal;
}): NumberRangeToParts[];
