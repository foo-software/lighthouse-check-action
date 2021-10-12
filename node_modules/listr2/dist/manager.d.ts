import { Listr } from './listr';
import { ListrBaseClassOptions, ListrContext, ListrError, ListrGetRendererClassFromValue, ListrRendererValue, ListrSubClassOptions, ListrTask } from './interfaces/listr.interface';
export declare class Manager<Ctx = ListrContext, Renderer extends ListrRendererValue = 'default', FallbackRenderer extends ListrRendererValue = 'verbose'> {
    options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>;
    err: ListrError[];
    private tasks;
    constructor(options?: ListrBaseClassOptions<Ctx, Renderer, FallbackRenderer>);
    set ctx(ctx: Ctx);
    add<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[] | ((ctx?: InjectCtx) => ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[]), options?: ListrSubClassOptions<InjectCtx, Renderer>): void;
    runAll<InjectCtx = Ctx>(options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>): Promise<InjectCtx>;
    newListr<InjectCtx, InjectRenderer extends ListrRendererValue = Renderer, InjectFallbackRenderer extends ListrRendererValue = FallbackRenderer>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<InjectRenderer>>[], options?: ListrBaseClassOptions<InjectCtx, InjectRenderer, InjectFallbackRenderer>): Listr<InjectCtx, InjectRenderer, InjectFallbackRenderer>;
    indent<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[] | ((ctx?: InjectCtx) => ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[]), options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>, taskOptions?: Omit<ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>, 'task'>): ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>;
    run<InjectCtx = Ctx>(tasks: ListrTask<InjectCtx, ListrGetRendererClassFromValue<Renderer>>[], options?: ListrBaseClassOptions<InjectCtx, Renderer, FallbackRenderer>): Promise<InjectCtx>;
    getRuntime(pipetime: number): string;
}
