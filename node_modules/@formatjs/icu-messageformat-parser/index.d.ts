import { Parser, ParserOptions } from './parser';
import { MessageFormatElement } from './types';
export declare function parse(message: string, opts?: ParserOptions): MessageFormatElement[];
export type { ParserOptions };
export * from './types';
export declare const _Parser: typeof Parser;
