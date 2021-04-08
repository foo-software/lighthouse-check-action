import _TreemapUtil = require('../app/src/util.js');

declare global {
  interface WebTreeMapOptions {
    padding: [number, number, number, number];
    spacing: number;
    caption(node: LH.Treemap.Node): string;
    showNode?(node: LH.Treemap.Node): boolean;
  }

  var webtreemap: {
    render(el: HTMLElement, data: any, options: WebTreeMapOptions): void;
    sort(data: any): void;
  };

  var TreemapUtil: typeof _TreemapUtil;

  interface Window {
    __treemapOptions?: LH.Treemap.Options;
  }
}

export {};
