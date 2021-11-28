/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {act, render} from '@testing-library/preact';

import {App} from '../src/app';
import {flowResult} from './sample-flow';

it('renders a standalone report with summary', async () => {
  const root = render(<App flowResult={flowResult}/>);

  expect(root.getByTestId('Summary')).toBeTruthy();
});

it('renders the navigation step', async () => {
  global.location.hash = '#index=0';
  const root = render(<App flowResult={flowResult}/>);

  expect(root.getByTestId('Report')).toBeTruthy();
});

it('renders the timespan step', async () => {
  global.location.hash = '#index=1';
  const root = render(<App flowResult={flowResult}/>);

  expect(root.getByTestId('Report')).toBeTruthy();
});

it('renders the snapshot step', async () => {
  global.location.hash = '#index=2';
  const root = render(<App flowResult={flowResult}/>);

  expect(root.getByTestId('Report')).toBeTruthy();
});

it('toggles collapsed mode when hamburger button clicked', async () => {
  const root = render(<App flowResult={flowResult}/>);

  const app = root.getByTestId('App');
  const hamburgerButton = root.getByLabelText('Button that opens and closes the sidebar');

  expect(app.classList).not.toContain('App--collapsed');

  await act(() => {
    hamburgerButton.click();
  });

  expect(app.classList).toContain('App--collapsed');
});
