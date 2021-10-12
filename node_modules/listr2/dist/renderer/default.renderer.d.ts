import { ListrRenderer, ListrTaskObject } from '../interfaces/listr.interface';
export declare class DefaultRenderer implements ListrRenderer {
    tasks: ListrTaskObject<any, typeof DefaultRenderer>[];
    options: typeof DefaultRenderer['rendererOptions'];
    renderHook$?: ListrTaskObject<any, any>['renderHook$'];
    static nonTTY: boolean;
    static rendererOptions: {
        indentation?: number;
        clearOutput?: boolean;
        showSubtasks?: boolean;
        collapse?: boolean;
        collapseSkips?: boolean;
        lazy?: boolean;
        showTimer?: boolean;
    };
    static rendererTaskOptions: {
        bottomBar?: boolean | number;
        persistentOutput?: boolean;
        showTimer?: boolean;
    };
    private id?;
    private bottomBar;
    private promptBar;
    private spinner;
    private spinnerPosition;
    constructor(tasks: ListrTaskObject<any, typeof DefaultRenderer>[], options: typeof DefaultRenderer['rendererOptions'], renderHook$?: ListrTaskObject<any, any>['renderHook$']);
    getTaskOptions(task: ListrTaskObject<any, typeof DefaultRenderer>): typeof DefaultRenderer['rendererTaskOptions'];
    isBottomBar(task: ListrTaskObject<any, typeof DefaultRenderer>): boolean;
    hasPersistentOutput(task: ListrTaskObject<any, typeof DefaultRenderer>): boolean;
    hasTimer(task: ListrTaskObject<any, typeof DefaultRenderer>): boolean;
    getTaskTime(task: ListrTaskObject<any, typeof DefaultRenderer>): string;
    render(): void;
    end(): void;
    private multiLineRenderer;
    private renderBottomBar;
    private renderPrompt;
    private dumpData;
    private formatString;
    private getSymbol;
}
