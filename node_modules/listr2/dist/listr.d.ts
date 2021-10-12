import { ListrBaseClassOptions, ListrClass, ListrContext, ListrDefaultRendererValue, ListrError, ListrFallbackRendererValue, ListrGetRendererClassFromValue, ListrGetRendererOptions, ListrRendererFactory, ListrRendererValue, ListrTask, ListrTaskObject } from './interfaces/listr.interface';
import { Task } from './lib/task';
export declare class Listr<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue, FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue> implements ListrClass<Ctx, Renderer, FallbackRenderer> {
    task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>;
    tasks: Task<Ctx, ListrGetRendererClassFromValue<Renderer>>[];
    err: ListrError[];
    rendererClass: ListrRendererFactory;
    rendererClassOptions: ListrGetRendererOptions<ListrRendererFactory>;
    renderHook$: ListrTaskObject<any, any>['renderHook$'];
    private concurrency;
    private renderer;
    constructor(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>);
    add(task: ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>> | ListrTask<Ctx, ListrGetRendererClassFromValue<Renderer>>[]): void;
    run(context?: Ctx): Promise<Ctx>;
    private checkAll;
    private runTask;
}
