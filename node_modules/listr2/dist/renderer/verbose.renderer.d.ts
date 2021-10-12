import { ListrRenderer, ListrTaskObject } from '../interfaces/listr.interface';
import { Logger } from '../utils/logger';
export declare class VerboseRenderer implements ListrRenderer {
    tasks: ListrTaskObject<any, typeof VerboseRenderer>[];
    options: typeof VerboseRenderer['rendererOptions'];
    static nonTTY: boolean;
    static rendererOptions: {
        useIcons?: boolean;
        logger?: new (...args: any) => Logger;
        logEmptyTitle?: boolean;
        logTitleChange?: boolean;
    };
    static rendererTaskOptions: never;
    private logger;
    constructor(tasks: ListrTaskObject<any, typeof VerboseRenderer>[], options: typeof VerboseRenderer['rendererOptions']);
    render(): void;
    end(): void;
    private verboseRenderer;
}
