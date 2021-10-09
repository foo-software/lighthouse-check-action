/**
 * @license Copyright 2017 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

import {strict as assert} from 'assert';

import {jest} from '@jest/globals';
import jsdom from 'jsdom';

import {DOM} from '../../renderer/dom.js';
import {Util} from '../../renderer/util.js';
import {I18n} from '../../renderer/i18n.js';

/* eslint-env jest */

describe('DOM', () => {
  /** @type {DOM} */
  let dom;
  let window;
  let nativeCreateObjectURL;

  beforeAll(() => {
    Util.i18n = new I18n('en', {...Util.UIStrings});
    window = new jsdom.JSDOM().window;

    // The Node version of URL.createObjectURL isn't compatible with the jsdom blob type,
    // so we stub it.
    nativeCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = jest.fn(_ => `https://fake-origin/blahblah-blobid`);

    dom = new DOM(window.document);
    dom.setLighthouseChannel('someChannel');
  });

  afterAll(() => {
    Util.i18n = undefined;
    URL.createObjectURL = nativeCreateObjectURL;
  });

  describe('createElement', () => {
    it('creates a simple element using default values', () => {
      const el = dom.createElement('div');
      assert.equal(el.localName, 'div');
      assert.equal(el.className, '');
      assert.equal(el.hasAttributes(), false);
    });

    it('creates an element from parameters', () => {
      const el = dom.createElement('div', ' class1  class2\n');
      assert.equal(el.localName, 'div');
      assert.equal(el.className, 'class1 class2');
    });

    it('creates an svg element from parameters', () => {
      const el = dom.createElementNS('http://www.w3.org/2000/svg', 'svg', ' class1  class2\n');
      assert.equal(el.localName, 'svg');
      assert.equal(el.className.baseVal, 'class1 class2');
    });
  });

  describe('createComponent', () => {
    it('should create a component', () => {
      const component = dom.createComponent('audit');
      assert.ok(component.querySelector('.lh-audit'));
    });

    it('fails when component cannot be found', () => {
      assert.throws(() => dom.createComponent('unknown-component'));
    });

    it('does not inject duplicate styles', () => {
      const clone = dom.createComponent('snippet');
      const clone2 = dom.createComponent('snippet');
      assert.ok(clone.querySelector('style'));
      assert.ok(!clone2.querySelector('style'));
    });
  });

  describe('convertMarkdownLinkSnippets', () => {
    it('correctly converts links', () => {
      let result = dom.convertMarkdownLinkSnippets(
          'Some [link](https://example.com/foo). [Learn more](http://example.com).');
      assert.equal(result.innerHTML,
          'Some <a rel="noopener" target="_blank" href="https://example.com/foo">link</a>. ' +
          '<a rel="noopener" target="_blank" href="http://example.com/">Learn more</a>.');

      result = dom.convertMarkdownLinkSnippets('[link](https://example.com/foo)');
      assert.equal(result.innerHTML,
          '<a rel="noopener" target="_blank" href="https://example.com/foo">link</a>',
          'just a link');

      result = dom.convertMarkdownLinkSnippets(
          '[ Link ](https://example.com/foo) and some text afterwards.');
      assert.equal(result.innerHTML,
          '<a rel="noopener" target="_blank" href="https://example.com/foo"> Link </a> ' +
          'and some text afterwards.', 'link with spaces in brackets');
    });

    it('handles invalid urls', () => {
      const text = 'Text has [bad](https:///) link.';
      assert.throws(() => {
        dom.convertMarkdownLinkSnippets(text);
      });
    });

    it('ignores links that do not start with http', () => {
      const snippets = [
        'Sentence with [link](/local/path).',
        'Sentence with [link](javascript:console.log("pwned")).',
        'Sentence with [link](chrome://settings#give-my-your-password).',
      ];

      for (const text of snippets) {
        const result = dom.convertMarkdownLinkSnippets(text);
        assert.equal(result.innerHTML, text);
      }
    });

    it('handles the case of [text]... [text](url)', () => {
      const text = 'Ensuring `<td>` cells using the `[headers]` are good. ' +
          '[Learn more](https://dequeuniversity.com/rules/axe/3.1/td-headers-attr).';
      const result = dom.convertMarkdownLinkSnippets(text);
      assert.equal(result.innerHTML, 'Ensuring `&lt;td&gt;` cells using the `[headers]` are ' +
          'good. <a rel="noopener" target="_blank" href="https://dequeuniversity.com/rules/axe/3.1/td-headers-attr">Learn more</a>.');
    });

    it('appends utm params to the URLs with https://developers.google.com origin', () => {
      const text = '[Learn more](https://developers.google.com/web/tools/lighthouse/audits/description).';

      const result = dom.convertMarkdownLinkSnippets(text);
      assert.equal(result.innerHTML, '<a rel="noopener" target="_blank" href="https://developers.google.com/web/tools/lighthouse/audits/description?utm_source=lighthouse&amp;utm_medium=someChannel">Learn more</a>.');
    });

    it('appends utm params to the URLs with https://web.dev origin', () => {
      const text = '[Learn more](https://web.dev/tap-targets/).';

      const result = dom.convertMarkdownLinkSnippets(text);
      assert.equal(result.innerHTML, '<a rel="noopener" target="_blank" href="https://web.dev/tap-targets/?utm_source=lighthouse&amp;utm_medium=someChannel">Learn more</a>.');
    });

    it('doesn\'t append utm params to other (non-docs) origins', () => {
      const text = '[Learn more](https://example.com/info).';

      const result = dom.convertMarkdownLinkSnippets(text);
      assert.equal(result.innerHTML, '<a rel="noopener" target="_blank" href="https://example.com/info">Learn more</a>.');
    });
  });

  describe('convertMarkdownCodeSnippets', () => {
    it('correctly converts links', () => {
      const result = dom.convertMarkdownCodeSnippets(
          'Here is some `code`, and then some `more code`, and yet event `more`.');
      assert.equal(result.innerHTML, 'Here is some <code>code</code>, and then some ' +
          '<code>more code</code>, and yet event <code>more</code>.');
    });
  });

  describe('safelySetHref', () => {
    it('sets href for safe destinations', () => {
      [
        'https://safe.com/',
        'http://safe.com/',
      ].forEach(url => {
        const a = dom.createElement('a');
        dom.safelySetHref(a, url);
        expect(a.href).toEqual(url);
      });
    });

    it('sets href for safe in-page named anchors', () => {
      const a = dom.createElement('a');
      dom.safelySetHref(a, '#footer');
      expect(a.href).toEqual('about:blank#footer');
    });

    it('doesnt set href if destination is unsafe', () => {
      [
        'javascript:evil()',
        'data:text/html;base64,abcdef',
        'data:application/json;base64,abcdef',
        'ftp://evil.com/',
        'blob:http://example.com/ca6df701-9c67-49fd-a787',
        'intent://example.com',
        'filesystem:http://localhost/img.png',
        'ws://evilchat.com/',
        'wss://evilchat.com/',
        'about:about',
        'chrome://chrome-urls/',
      ].forEach(url => {
        const a = dom.createElement('a');
        dom.safelySetHref(a, url);

        expect(a.href).toEqual('');
        expect(a.getAttribute('href')).toEqual(null);
      });
    });

    it('handles if url is undefined (because of proto roundtrip)', () => {
      const a = dom.createElement('a');
      dom.safelySetHref(a, undefined);
      expect(a.href).toEqual('');
    });
  });

  describe('safelySetBlobHref', () => {
    it('sets href for safe blob types', () => {
      [
        new window.Blob([JSON.stringify({test: 1234})], {type: 'application/json'}),
        new window.Blob([`<html><h1>hello`], {type: 'text/html'}),
      ].forEach(blob => {
        const a = dom.createElement('a');
        dom.safelySetBlobHref(a, blob);
        expect(a.href).toEqual('https://fake-origin/blahblah-blobid');
      });
    });

    it('throws with unsupported blob types', () => {
      [
        new window.Blob(['<xml>'], {type: 'image/svg+xml'}),
        new window.Blob(['evilbinary'], {type: 'application/octet-stream'}),
        new window.Blob(['fake']),
      ].forEach(blob => {
        const a = dom.createElement('a');
        expect(() => {
          dom.safelySetBlobHref(a, blob);
        }).toThrowError(/Unsupported blob/);
      });
    });
  });
});
