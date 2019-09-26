/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
// @ts-nocheck
'use strict';

/* eslint-disable no-console */

const http = require('http');
const zlib = require('zlib');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const mime = require('mime-types');
const parseQueryString = require('querystring').parse;
const parseURL = require('url').parse;
const URLSearchParams = require('url').URLSearchParams;
const HEADER_SAFELIST = new Set(['x-robots-tag', 'link']);

const lhRootDirPath = path.join(__dirname, '../../../');

function requestHandler(request, response) {
  const requestUrl = parseURL(request.url);
  const filePath = requestUrl.pathname;
  const queryString = requestUrl.search && parseQueryString(requestUrl.search.slice(1));
  let absoluteFilePath = path.join(__dirname, filePath);

  // Create an index page that lists the available test pages.
  if (filePath === '/') {
    const fixturePaths = glob.sync('**/*.html', {cwd: __dirname});
    const html = `
      <html>
      <h1>Smoke test fixtures</h1>
      ${fixturePaths.map(p => `<a href=${encodeURI(p)}>${escape(p)}</a>`).join('<br>')}
    `;
    response.writeHead(200, {
      'Content-Security-Policy': `default-src 'none';`,
    });
    sendResponse(200, html);
    return;
  }

  if (filePath.startsWith('/dist/viewer')) {
    // Rewrite lighthouse-viewer paths to point to that location.
    absoluteFilePath = path.join(__dirname, '/../../../', filePath);
  }

  // Disallow file requests outside of LH folder
  const filePathDir = path.parse(absoluteFilePath).dir;
  if (!filePathDir.startsWith(lhRootDirPath)) {
    return readFileCallback(new Error('Disallowed path'));
  }

  // Check if the file exists, then read it and serve it.
  fs.exists(absoluteFilePath, fsExistsCallback);

  function fsExistsCallback(fileExists) {
    if (!fileExists) {
      return sendResponse(404, `404 - File not found. ${filePath}`);
    }
    fs.readFile(absoluteFilePath, 'binary', readFileCallback);
  }

  function readFileCallback(err, file) {
    if (err) {
      console.error(`Unable to read local file ${absoluteFilePath}:`, err);
      return sendResponse(500, '500 - Internal Server Error');
    }
    sendResponse(200, file);
  }

  function sendResponse(statusCode, data) {
    const headers = {'Access-Control-Allow-Origin': '*'};

    const contentType = mime.lookup(filePath);
    const charset = mime.lookup(contentType);
    // `mime.contentType` appends the correct charset too.
    // Note: it seems to miss just one case, svg. Doesn't matter much, we'll just allow
    // svgs to fallback to binary encoding. `Content-Type: image/svg+xml` is sufficient for our use case.
    // see https://github.com/jshttp/mime-types/issues/66
    if (contentType) headers['Content-Type'] = mime.contentType(contentType);

    let delay = 0;
    let useGzip = false;
    if (queryString) {
      const params = new URLSearchParams(queryString);
      // set document status-code
      if (params.has('status_code')) {
        statusCode = parseInt(params.get('status_code'), 10);
      }

      // set delay of request when present
      if (params.has('delay')) {
        delay = parseInt(params.get('delay'), 10) || 2000;
      }

      if (params.has('extra_header')) {
        const extraHeaders = new URLSearchParams(params.get('extra_header'));
        for (const [headerName, headerValue] of extraHeaders) {
          if (HEADER_SAFELIST.has(headerName.toLowerCase())) {
            headers[headerName] = headers[headerName] || [];
            headers[headerName].push(headerValue);
          }
        }
      }

      if (params.has('gzip')) {
        useGzip = Boolean(params.get('gzip'));
      }

      // redirect url to new url if present
      if (params.has('redirect')) {
        return setTimeout(sendRedirect, delay, params.get('redirect'));
      }
    }

    if (useGzip) {
      data = zlib.gzipSync(data);
      headers['Content-Encoding'] = 'gzip';
    }

    response.writeHead(statusCode, headers);

    // Delay the response
    if (delay > 0) {
      return setTimeout(finishResponse, delay, data);
    }

    const encoding = charset === 'UTF-8' ? 'utf-8' : 'binary';
    finishResponse(data, encoding);
  }

  function sendRedirect(url) {
    const headers = {
      Location: url,
    };
    response.writeHead(302, headers);
    response.end();
  }

  function finishResponse(data, encoding) {
    response.write(data, encoding);
    response.end();
  }
}

const serverForOnline = http.createServer(requestHandler);
const serverForOffline = http.createServer(requestHandler);

serverForOnline.on('error', e => console.error(e.code, e));
serverForOffline.on('error', e => console.error(e.code, e));

// If called via `node static-server.js` then start listening, otherwise, just expose the servers
if (require.main === module) {
  // Start listening
  const onlinePort = 10200;
  const offlinePort = 10503;
  serverForOnline.listen(onlinePort, 'localhost');
  serverForOffline.listen(offlinePort, 'localhost');
  console.log(`online:  listening on http://localhost:${onlinePort}`);
  console.log(`offline: listening on http://localhost:${offlinePort}`);
} else {
  module.exports = {
    server: serverForOnline,
    serverForOffline,
  };
}

