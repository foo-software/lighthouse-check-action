/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

import {render} from '@testing-library/preact';
import {FunctionComponent} from 'preact';

import {SidebarFlow} from '../../src/sidebar/flow';
import {FlowResultContext} from '../../src/util';
import {flowResult} from '../sample-flow';

let wrapper: FunctionComponent;

beforeEach(() => {
  wrapper = ({children}) => (
    <FlowResultContext.Provider value={flowResult}>{children}</FlowResultContext.Provider>
  );
});

describe('SidebarFlow', () => {
  it('renders flow steps', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const navigation = root.getByText('Navigation report (www.mikescerealshack.co/)');
    const timespan = root.getByText('Search input');
    const snapshot = root.getByText('Search results');
    const navigation2 = root.getByText('Navigation report (www.mikescerealshack.co/corrections)');

    const links = root.getAllByRole('link') as HTMLAnchorElement[];
    expect(links.map(a => a.textContent)).toEqual([
      navigation.textContent,
      timespan.textContent,
      snapshot.textContent,
      navigation2.textContent,
    ]);
    expect(links.map(a => a.href)).toEqual([
      'file:///Users/example/report.html/#index=0',
      'file:///Users/example/report.html/#index=1',
      'file:///Users/example/report.html/#index=2',
      'file:///Users/example/report.html/#index=3',
    ]);
  });

  it('no steps highlighted on summary page', async () => {
    const root = render(<SidebarFlow/>, {wrapper});

    const links = root.getAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(0);
  });

  it('highlight current step', async () => {
    global.location.hash = '#index=1';
    const root = render(<SidebarFlow/>, {wrapper});

    const links = root.getAllByRole('link');
    const highlighted = links.filter(h => h.classList.contains('Sidebar--current'));

    expect(highlighted).toHaveLength(1);
    expect(links[1]).toEqual(highlighted[0]);
  });
});
