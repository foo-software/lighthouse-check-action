/// <reference types="node" />
import Enquirer from 'enquirer';
import { Observable, Subject } from 'rxjs';
import { Readable } from 'stream';
import { stateConstants } from './state.constants';
import { Task } from '../lib/task';
import { DefaultRenderer } from '../renderer/default.renderer';
import { SilentRenderer } from '../renderer/silent.renderer';
import { VerboseRenderer } from '../renderer/verbose.renderer';
import { Listr } from '../index';
import { PromptOptions } from '../utils/prompt.interface';
export declare type ListrContext = any;
export declare type ListrDefaultRendererValue = 'default';
export declare type ListrDefaultRenderer = typeof DefaultRenderer;
export declare type ListrFallbackRendererValue = 'verbose';
export declare type ListrFallbackRenderer = typeof VerboseRenderer;
export declare class ListrClass<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> {
    tasks: Task<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    constructor(task?: readonly ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>);
    run(ctx?: Ctx): Promise<Ctx>;
    add(tasks: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | readonly ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[]): void;
}
export interface ListrTaskObject<Ctx, Renderer extends ListrRendererFactory> extends Observable<ListrEvent> {
    id: string;
    title?: string;
    cleanTitle?: string;
    output?: string;
    task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    skip: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>);
    subtasks: ListrTaskObject<Ctx, any>[];
    state: string;
    message: {
        duration?: number;
        error?: string;
        skip?: string;
    };
    check: (ctx: Ctx) => void;
    run: (ctx: Ctx, wrapper: ListrTaskWrapper<Ctx, Renderer>) => Promise<void>;
    options: ListrOptions;
    rendererOptions: ListrGetRendererOptions<Renderer>;
    rendererTaskOptions: ListrGetRendererTaskOptions<Renderer>;
    renderHook$: Subject<void>;
    hasSubtasks(): boolean;
    isPending(): boolean;
    isSkipped(): boolean;
    isCompleted(): boolean;
    isEnabled(): boolean;
    isPrompt(): boolean;
    hasFailed(): boolean;
    hasTitle(): boolean;
}
export interface ListrTask<Ctx = ListrContext, Renderer extends ListrRendererFactory = any> {
    title?: string;
    task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>;
    skip?: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>);
    enabled?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>);
    options?: ListrGetRendererTaskOptions<Renderer>;
}
export interface ListrTaskWrapper<Ctx, Renderer extends ListrRendererFactory> {
    title: string;
    output: string;
    newListr(task: ListrTask<Ctx, Renderer> | ListrTask<Ctx, Renderer>[] | ((parent: this) => ListrTask<Ctx, Renderer> | ListrTask<Ctx, Renderer>[]), options?: ListrSubClassOptions<Ctx, Renderer>): Listr<Ctx, any, any>;
    report(error: Error): void;
    skip(message: string): void;
    run(ctx?: Ctx, task?: ListrTaskWrapper<Ctx, Renderer>): Promise<void>;
    prompt<T = any>(options: PromptOptions | PromptOptions<true>[]): Promise<T>;
    stdout(): NodeJS.WritableStream;
}
export declare type ListrTaskResult<Ctx> = string | Promise<any> | ListrClass<Ctx, ListrRendererFactory, any> | Readable | NodeJS.ReadableStream | Observable<any>;
export declare type ListrBaseClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> = ListrOptions<Ctx> & ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>;
export declare type ListrSubClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue> = ListrOptions<Ctx> & Omit<ListrDefaultRendererOptions<Renderer>, 'renderer'>;
export interface ListrOptions<Ctx = ListrContext> {
    concurrent?: boolean | number;
    exitOnError?: boolean;
    ctx?: Ctx;
    registerSignalListeners?: boolean;
    rendererFallback?: boolean | (() => boolean);
    rendererSilent?: boolean | (() => boolean);
    disableColor?: boolean;
    injectWrapper?: {
        enquirer?: Enquirer<object>;
    };
}
export declare type CreateClass<T> = new (...args: any[]) => T;
export declare type ListrGetRendererClassFromValue<T extends ListrRendererValue> = T extends 'default' ? typeof DefaultRenderer : T extends 'verbose' ? typeof VerboseRenderer : T extends 'silent' ? typeof SilentRenderer : T extends ListrRendererFactory ? T : never;
export declare type ListrGetRendererValueFromClass<T extends ListrRendererFactory> = T extends DefaultRenderer ? 'default' : T extends VerboseRenderer ? 'verbose' : T extends SilentRenderer ? 'silent' : T extends ListrRendererFactory ? T : never;
export declare type ListrGetRendererOptions<T extends ListrRendererValue> = T extends 'default' ? typeof DefaultRenderer['rendererOptions'] : T extends 'verbose' ? typeof VerboseRenderer['rendererOptions'] : T extends 'silent' ? typeof SilentRenderer['rendererOptions'] : T extends ListrRendererFactory ? T['rendererOptions'] : never;
export declare type ListrGetRendererTaskOptions<T extends ListrRendererValue> = T extends 'default' ? typeof DefaultRenderer['rendererTaskOptions'] : T extends 'verbose' ? typeof VerboseRenderer['rendererTaskOptions'] : T extends 'silent' ? typeof SilentRenderer['rendererTaskOptions'] : T extends ListrRendererFactory ? T['rendererTaskOptions'] : never;
export interface ListrDefaultRendererOptions<T extends ListrRendererValue> {
    renderer?: T;
    rendererOptions?: ListrGetRendererOptions<T>;
}
export interface ListrDefaultNonTTYRendererOptions<T extends ListrRendererValue> {
    nonTTYRenderer?: T;
    nonTTYRendererOptions?: ListrGetRendererOptions<T>;
}
export declare type ListrRendererOptions<Renderer extends ListrRendererValue, FallbackRenderer extends ListrRendererValue> = ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>;
export declare class ListrRenderer {
    static rendererOptions: Record<string, any>;
    static rendererTaskOptions: Record<string, any>;
    static nonTTY: boolean;
    constructor(tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions);
    render(): void;
    end(err?: Error): void;
}
export declare class ListrBaseRenderer implements ListrRenderer {
    static rendererOptions: Record<string, any>;
    static rendererTaskOptions: Record<string, any>;
    static nonTTY: boolean;
    tasks: ListrTaskObject<any, typeof ListrBaseRenderer>[];
    options: typeof ListrBaseRenderer.rendererOptions;
    constructor(tasks: ListrTaskObject<any, typeof ListrBaseRenderer>[], options: typeof ListrBaseRenderer.rendererOptions);
    render(): void;
    end(err?: Error): void;
}
export interface ListrRendererFactory {
    rendererOptions: Record<string, any>;
    rendererTaskOptions: Record<string, any>;
    nonTTY: boolean;
    new (tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions, renderHook$?: Subject<void>): ListrRenderer;
}
export declare type ListrRendererValue = 'silent' | 'default' | 'verbose' | ListrRendererFactory;
export declare type ListrEvent = {
    type: Exclude<ListrEventTypes, 'MESSAGE'>;
    data?: string | boolean;
} | {
    type: 'MESSAGE';
    data: ListrTaskObject<any, any>['message'];
};
export declare class ListrError extends Error {
    message: string;
    errors?: Error[];
    context?: any;
    constructor(message: string, errors?: Error[], context?: any);
}
export declare class PromptError extends Error {
    constructor(message: any);
}
export declare type ListrEventTypes = 'TITLE' | 'STATE' | 'ENABLED' | 'SUBTASK' | 'DATA' | 'MESSAGE';
export declare type StateConstants = stateConstants;
