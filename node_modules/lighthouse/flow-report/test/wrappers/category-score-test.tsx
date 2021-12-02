/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {render} from '@testing-library/preact';

import {CategoryScore} from '../../src/wrappers/category-score';
import {FlowResultContext} from '../../src/util';
import {I18nProvider} from '../../src/i18n/i18n';
import {flowResult} from '../sample-flow';

let wrapper: FunctionComponent;

beforeEach(() => {
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>
      <I18nProvider>
        {children}
      </I18nProvider>
    </FlowResultContext.Provider>
  );
});

describe('CategoryScore', () => {
  it('renders score gauge', () => {
    const category: any = {
      id: 'seo',
      score: 0.95,
      auditRefs: [],
    };
    const root = render(
      <CategoryScore category={category} href="#seo" gatherMode="navigation"/>,
      {wrapper}
    );

    const link = root.getByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html/#seo');
    expect(root.getByText('95')).toBeTruthy();
    expect(root.baseElement.querySelector('.lh-gauge__label')).toBeFalsy();
  });

  it('renders error gauge', () => {
    const category: any = {
      id: 'seo',
      score: null,
      auditRefs: [],
    };
    const root = render(
      <CategoryScore category={category} href="#seo" gatherMode="navigation"/>,
      {wrapper}
    );

    const link = root.getByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html/#seo');
    expect(root.getByText('?')).toBeTruthy();
  });

  it('renders category fraction', () => {
    const category: any = {
      id: 'seo',
      auditRefs: [
        {weight: 1, result: {score: 1, scoreDisplayMode: 'binary'}},
        {weight: 1, result: {score: 1, scoreDisplayMode: 'binary'}},
        {weight: 1, result: {score: 0, scoreDisplayMode: 'binary'}},
        {weight: 1, result: {score: 0, scoreDisplayMode: 'binary'}},
      ],
    };
    const root = render(
      <CategoryScore category={category} href="#seo" gatherMode="timespan"/>,
      {wrapper}
    );

    const link = root.getByRole('link') as HTMLAnchorElement;

    expect(link.href).toEqual('file:///Users/example/report.html/#seo');
    expect(root.getByText('2/4')).toBeTruthy();
    expect(root.baseElement.querySelector('.lh-fraction__label')).toBeFalsy();
  });
});
