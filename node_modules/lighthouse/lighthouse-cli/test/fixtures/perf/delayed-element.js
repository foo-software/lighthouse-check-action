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

/** Render large number of elements to fill up the backend node cache. */
async function rerender(iterations) {
  const waitForAnimationFrame = () => new Promise(r => requestAnimationFrame(r))

  for (let i = 0; i < iterations; i++) {
    const filler = `<div>Filler element</div>`.repeat(4000);
    document.body.innerHTML = `<div id="div-${i}">${i} left</div>${filler}`;
    await waitForAnimationFrame()
  }
}

// largest-contentful-paint-element: add the largest element later in page load
// layout-shift-elements: shift down the `<h1>` in the page
setTimeout(() => {
  const imgEl = document.createElement('img');
  imgEl.src = '../dobetterweb/lighthouse-480x318.jpg';
  const textEl = document.createElement('span');
  textEl.textContent = 'Sorry!';
  const top = document.getElementById('late-content');
  top.appendChild(imgEl);
  top.appendChild(textEl);

  // layout-shift-elements: ensure we can handle missing shift elements
  if (window.location.href.includes('?missing')) {
    stall(100); // force a long task to ensure we reach the rerendering stage
    setTimeout(async () => {
      await rerender(20); // rerender a large number of nodes to evict the early layout shift node
      document.body.textContent = 'Now it is all gone!';
    }, 50);
  }
}, 1000);

// long-tasks: add a very long task at least 500ms
stall(800);
