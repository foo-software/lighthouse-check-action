/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {useEffect, useLayoutEffect, useRef} from 'preact/hooks';

import {useCurrentLhr, useHashParam} from '../util';
import {useReportRenderer} from './report-renderer';

/**
 * The default behavior of anchor links is not compatible with the flow report's hash navigation.
 * This function converts any anchor links under the provided element to a flow report link.
 * e.g. <a href="#link"> -> <a href="#index=0&anchor=link">
 */
export function convertChildAnchors(element: HTMLElement, index: number) {
  const links = element.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>;
  for (const link of links) {
    // Check if the link destination is in the report.
    const currentUrl = new URL(location.href);
    currentUrl.hash = '';
    currentUrl.search = '';
    const linkUrl = new URL(link.href);
    linkUrl.hash = '';
    linkUrl.search = '';
    if (currentUrl.href !== linkUrl.href || !link.hash) continue;

    const nodeId = link.hash.substr(1);
    link.hash = `#index=${index}&anchor=${nodeId}`;
  }
}

export const Report: FunctionComponent = () => {
  const {dom, reportRenderer} = useReportRenderer();
  const ref = useRef<HTMLDivElement>(null);
  const anchor = useHashParam('anchor');
  const currentLhr = useCurrentLhr();

  useLayoutEffect(() => {
    if (!currentLhr) return;

    if (ref.current) {
      dom.clearComponentCache();
      reportRenderer.renderReport(currentLhr.value, ref.current);
      convertChildAnchors(ref.current, currentLhr.index);
    }

    return () => {
      if (ref.current) ref.current.textContent = '';
    };
  }, [reportRenderer, currentLhr]);

  useEffect(() => {
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
        return;
      }
    }

    // Scroll to top no anchor is found.
    if (ref.current) ref.current.scrollIntoView();
  }, [anchor, currentLhr]);

  return (
    <div ref={ref} className="lh-root" data-testid="Report"/>
  );
};
