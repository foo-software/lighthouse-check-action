import { SupportedRenderer } from './renderer.interface';
import { ListrRendererValue, ListrOptions } from '../interfaces/listr.interface';
export declare function getRenderer(renderer: ListrRendererValue, fallbackRenderer?: ListrRendererValue, fallbackCondition?: ListrOptions['rendererFallback'], silentCondition?: ListrOptions['rendererSilent']): SupportedRenderer;
