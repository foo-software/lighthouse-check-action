import { PromptOptions, PromptSettings } from './prompt.interface';
export declare function createPrompt(options: PromptOptions | PromptOptions<true>[], settings?: PromptSettings): Promise<any>;
