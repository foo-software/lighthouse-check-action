/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import fs from 'fs';

import jsdom from 'jsdom';
import expect from 'expect';

import {DOM} from '../../renderer/dom.js';
import {LH_ROOT} from '../../../root.js';
import {normalizeTextNodeText} from '../../../build/build-report-components.js';

const html = fs.readFileSync(LH_ROOT + '/report/assets/templates.html', 'utf-8');
const {window} = new jsdom.JSDOM(html);
const tmplEls = window.document.querySelectorAll('template');

/**
 * @param {HTMLTemplateElement} tmplEl
 */
async function assertDOMTreeMatches(tmplEl) {
  global.document = window.document;
  global.Node = window.Node;
  global.DocumentFragment = window.DocumentFragment;

  const dom = new DOM(window.document);

  /**
   * @param {HTMLElement} parentEl
   */
  function normalizeNodes(parentEl) {
    for (const child of Array.from(parentEl.childNodes)) {
      if (child.nodeType === window.Node.TEXT_NODE) {
        const text = normalizeTextNodeText(child);
        if (!text) parentEl.removeChild(child);
        else child.textContent = text;
      } else if (child.nodeType === window.Node.COMMENT_NODE) {
        parentEl.removeChild(child);
      } else if (child.nodeType === window.Node.ELEMENT_NODE) {
        normalizeNodes(child);
      }
    }
  }

  /**
   * @param {HTMLElement} rootEl
   */
  function normalizeAttributes(rootEl) {
    for (const el of rootEl.querySelectorAll('*')) {
      const clonedAttrNodes = Array.from(el.attributes);
      // Clear existing.
      clonedAttrNodes.forEach(attr => el.removeAttribute(attr.localName));
      // Apply class first, then the rest.
      const classAttr = clonedAttrNodes.find(attr => attr.localName === 'class');
      if (classAttr) {
        el.setAttributeNode(classAttr);
      }
      clonedAttrNodes.forEach(attr => {
        if (attr !== classAttr) el.setAttributeNode(attr);
      });
    }
  }

  /** @type {DocumentFragment} */
  const generatedFragment = dom.createComponent(tmplEl.id);
  const originalFragment = tmplEl.content.cloneNode(true);

  // We rely on innerHTML to do a comparison, so we must normalize some things about the
  // original element for two reasons:
  // 1) Some nodes are purposefully not created in components.js; or the text content is trimmed.
  normalizeNodes(originalFragment);
  // 2) jsdom reorders the class attribute in unexpected ways. We always author it as the first attribute, but
  //    sometimes jsdom moves it around.
  normalizeAttributes(originalFragment);

  expect(generatedFragment.childNodes.length).toEqual(originalFragment.childNodes.length);
  for (let i = 0; i < generatedFragment.childNodes.length; i++) {
    expect(generatedFragment.childNodes[i].innerHTML)
      .toEqual(originalFragment.childNodes[i].innerHTML);
  }
}

const originalCreateElement = DOM.prototype.createElement;
const originalCreateElementNS = DOM.prototype.createElementNS;
beforeAll(() => {
  /**
   * @param {string} classNames
   */
  function checkPrefix(classNames) {
    if (!classNames) return;

    for (const className of classNames.split(' ')) {
      if (!className.startsWith('lh-')) {
        throw new Error(`expected classname to start with lh-, got: ${className}`);
      }
    }
  }

  DOM.prototype.createElement = function(...args) {
    const classNames = args[1];
    checkPrefix(classNames);
    return originalCreateElement.call(this, ...args);
  };
  DOM.prototype.createElementNS = function(...args) {
    const classNames = args[2];
    checkPrefix(classNames);
    return originalCreateElementNS.call(this, ...args);
  };
});

afterAll(() => {
  DOM.prototype.createElement = originalCreateElement;
  DOM.prototype.createElementNS = originalCreateElementNS;
});

for (const tmpEl of tmplEls) {
  it(`${tmpEl.id} component matches HTML source`, async () => {
    await assertDOMTreeMatches(tmpEl);
  });
}
