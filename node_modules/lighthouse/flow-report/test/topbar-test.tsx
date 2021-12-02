/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {jest} from '@jest/globals';
import {FunctionComponent} from 'preact';
import {act, render} from '@testing-library/preact';

import {FlowResultContext, OptionsContext} from '../src/util';
import {I18nProvider} from '../src/i18n/i18n';

const mockSaveFile = jest.fn();
jest.unstable_mockModule('../../../report/renderer/api.js', () => ({
  saveFile: mockSaveFile,
}));

let Topbar: typeof import('../src/topbar').Topbar;
beforeAll(async () => {
  Topbar = (await import('../src/topbar')).Topbar;
});

const flowResult = {
  name: 'User flow',
  steps: [{lhr: {
    fetchTime: '2021-09-14T22:24:22.462Z',
    configSettings: {locale: 'en-US'},
    i18n: {rendererFormattedStrings: {}},
  }}],
} as any;

let wrapper: FunctionComponent;
let options: LH.FlowReportOptions;

beforeEach(() => {
  mockSaveFile.mockReset();
  options = {};
  wrapper = ({children}) => (
    <OptionsContext.Provider value={options}>
      <FlowResultContext.Provider value={flowResult}>
        <I18nProvider>
          {children}
        </I18nProvider>
      </FlowResultContext.Provider>
    </OptionsContext.Provider>
  );
});

it('save button opens save dialog for HTML file', async () => {
  options = {getReportHtml: () => '<html></html>'};
  const root = render(<Topbar onMenuClick={() => {}}/>, {wrapper});

  const saveButton = root.getByText('Save');
  saveButton.click();

  expect(mockSaveFile).toHaveBeenCalledWith(
    expect.any(Blob),
    'User-flow_2021-09-14_22-24-22'
  );
});

it('provides save as gist option if defined', async () => {
  const saveAsGist = jest.fn();
  options = {saveAsGist};
  const root = render(<Topbar onMenuClick={() => {}}/>, {wrapper});

  const saveButton = root.getByText('Save as Gist');
  saveButton.click();

  expect(saveAsGist).toHaveBeenCalledWith(flowResult);
});

it('toggles help dialog', async () => {
  const root = render(<Topbar onMenuClick={() => {}}/>, {wrapper});

  expect(root.queryByText(/Use Navigation reports to/)).toBeFalsy();
  const helpButton = root.getByText('Understanding Flows');

  await act(() => helpButton.click());
  expect(root.getByText(/Use Navigation reports to/)).toBeTruthy();

  await act(() => helpButton.click());
  expect(root.queryByText(/Use Navigation reports to/)).toBeFalsy();
});
