import { NumberFormatInternal, NumberFormatPart } from '../types/number';
/**
 * https://tc39.es/ecma402/#sec-partitionnumberrangepattern
 */
export declare function PartitionNumberRangePattern(numberFormat: Intl.NumberFormat, x: number, y: number, { getInternalSlots, }: {
    getInternalSlots(nf: Intl.NumberFormat): NumberFormatInternal;
}): NumberFormatPart[];
