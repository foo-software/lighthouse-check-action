/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {FunctionComponent} from 'preact';
import {render} from '@testing-library/preact';

import {Header} from '../src/header';
import {FlowResultContext} from '../src/util';
import {flowResult} from './sample-flow';
import {I18nProvider} from '../src/i18n/i18n';

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

it('renders all sections for a middle step', () => {
  const hashState = {index: 1} as any;
  const root = render(<Header hashState={hashState}/>, {wrapper});

  expect(root.baseElement.querySelector('.Header__prev-thumbnail')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__prev-title')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__next-thumbnail')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__next-title')).toBeTruthy();
});

it('renders only next section for first step', () => {
  const hashState = {index: 0} as any;
  const root = render(<Header hashState={hashState}/>, {wrapper});

  expect(root.baseElement.querySelector('.Header__prev-thumbnail')).toBeFalsy();
  expect(root.baseElement.querySelector('.Header__prev-title')).toBeFalsy();
  expect(root.baseElement.querySelector('.Header__next-thumbnail')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__next-title')).toBeTruthy();
});

it('renders only previous section for last step', () => {
  const hashState = {index: 3} as any;
  const root = render(<Header hashState={hashState}/>, {wrapper});

  expect(root.baseElement.querySelector('.Header__prev-thumbnail')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__prev-title')).toBeTruthy();
  expect(root.baseElement.querySelector('.Header__next-thumbnail')).toBeFalsy();
  expect(root.baseElement.querySelector('.Header__next-title')).toBeFalsy();
});
