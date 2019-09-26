# Robots Parser [![DeepScan Grade](https://deepscan.io/api/projects/1275/branches/3378/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1275&bid=3378) [![GitHub license](https://img.shields.io/github/license/samclarke/robots-parser.svg)](https://github.com/samclarke/robots-parser/blob/master/license.md)

NodeJS robots.txt parser.

It currently supports:

  * User-agent:
  * Allow:
  * Disallow:
  * Sitemap:
  * Crawl-delay:
  * Host:
  * Paths with wildcards (*) and EOL matching ($)

## Installation

Via NPM:

    npm install robots-parser

or via Yarn:

    yarn add robots-parser

## Usage

```js
var robotsParser = require('robots-parser');

var robots = robotsParser('http://www.example.com/robots.txt', [
	'User-agent: *',
	'Disallow: /dir/',
	'Disallow: /test.html',
	'Allow: /dir/test.html',
	'Allow: /test.html',
	'Crawl-delay: 1',
	'Sitemap: http://example.com/sitemap.xml',
	'Host: example.com'
].join('\n'));

robots.isAllowed('http://www.example.com/test.html', 'Sams-Bot/1.0'); // false
robots.isAllowed('http://www.example.com/dir/test.html', 'Sams-Bot/1.0'); // true
robots.isDisallowed('http://www.example.com/dir/test2.html', 'Sams-Bot/1.0'); // true
robots.getCrawlDelay('Sams-Bot/1.0'); // 1
robots.getSitemaps(); // ['http://example.com/sitemap.xml']
robots.getPreferedHost(); // example.com
```


### isAllowed(url, [ua])
**boolean or undefined**

Returns true if crawling the specified URL is allowed for the specified user-agent.

This will return `undefined` if the URL isn't valid for this robots.txt.


### isDisallowed(url, [ua])
**boolean or undefined**

Returns true if crawling the specified URL is not allowed for the specified user-agent.

This will return `undefined` if the URL isn't valid for this robots.txt.


### getMatchingLineNumber(url, [ua])
**number or undefined**

Returns the line number of the matching directive for the specified URL and user-agent if any.

Line numbers start at 1 and go up (1-based indexing).

Returns -1 if there is no matching directive. If a rule is manually added without a lineNumber then this will return undefined for that rule.


### getCrawlDelay([ua])
**number or undefined**

Returns the number of seconds the specified user-agent should wait between requests.

Returns undefined if no crawl delay has been specified for this user-agent.


### getSitemaps()
**array**

Returns an array of sitemap URLs specified by the `sitemap:` directive.


### getPreferredHost()
**string or null**

Returns the preferred host name specified by the `host:` directive or null if there isn't one.


# Changes

### Version 2.1.1:

 * Fix bug that could be used to causing rule checking to take a long time
   &ndash; Thanks to @andeanfog

### Version 2.1.0:

 * Removed use of punycode module API's as new URL API handles it
 * Improved test coverage
 * Added tests for percent encoded paths and improved support
 * Added `getMatchingLineNumber()` method
 * Fixed bug with comments on same line as directive

### Version 2.0.0:

This release is not 100% backwards compatible as it now uses the new URL APIs which are not supported in Node < 7.

 * Update code to not use deprecated URL module API's.
   &ndash; Thanks to @kdzwinel

### Version 1.0.2:

 * Fixed error caused by invalid URLs missing the protocol.

### Version 1.0.1:

 * Fixed bug with the "user-agent" rule being treated as case sensitive.
   &ndash; Thanks to @brendonboshell
 * Improved test coverage.
   &ndash; Thanks to @schornio

### Version 1.0.0:

 * Initial release.


# License

	The MIT License (MIT)

	Copyright (c) 2014 Sam Clarke

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
