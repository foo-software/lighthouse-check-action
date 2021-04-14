/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/* eslint-disable */

/** Create long tasks on the main thread. */
function stall(ms) {
  const start = performance.now();
  while (performance.now() - start < ms) ;
}

// largest-contentful-paint-element: add the largest element later in page load
// layout-shift-elements: shift down the `<h1>` in the page
setTimeout(() => {
  const imgEl = document.createElement('img');
  imgEl.src = '../dobetterweb/lighthouse-480x318.jpg';
  const textEl = document.createElement('div');
  textEl.textContent = 'Sorry!';
  textEl.style.height = '18px' // this height can be flaky so we set it manually
  const top = document.getElementById('late-content');

  // Use shadow DOM to verify devtoolsNodePath resolves through it
  const shadowRoot = top.attachShadow({mode: 'open'});
  const sectionEl = document.createElement('section');
  sectionEl.append(imgEl, textEl);
  shadowRoot.append(sectionEl);
}, 1000);

// long-tasks: add a very long task at least 500ms
stall(800);
