import { ListrRenderer, ListrTaskObject } from '../interfaces/listr.interface';
export declare class SilentRenderer implements ListrRenderer {
    tasks: ListrTaskObject<any, typeof SilentRenderer>[];
    options: typeof SilentRenderer['rendererOptions'];
    static nonTTY: boolean;
    static rendererOptions: never;
    static rendererTaskOptions: never;
    constructor(tasks: ListrTaskObject<any, typeof SilentRenderer>[], options: typeof SilentRenderer['rendererOptions']);
    render(): void;
    end(): void;
}
