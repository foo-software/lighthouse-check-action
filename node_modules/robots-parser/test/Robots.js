var robotsParser = require('../index');
var expect = require('chai').expect;


function testRobots(url, contents, allowed, disallowed) {
	var robots = robotsParser(url, contents);

	allowed.forEach(function (url) {
		expect(robots.isAllowed(url)).to.equal(true);
	});

	disallowed.forEach(function (url) {
		expect(robots.isDisallowed(url)).to.equal(true);
	});
}

describe('Robots', function () {
	it('should parse the disallow directive', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /fish/',
			'Disallow: /test.html'
		].join('\n');

		var allowed = [
			'http://www.example.com/fish',
			'http://www.example.com/Test.html'
		];

		var disallowed = [
			'http://www.example.com/fish/index.php',
			'http://www.example.com/fish/',
			'http://www.example.com/test.html'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should parse the allow directive', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /fish/',
			'Disallow: /test.html',
			'Allow: /fish/test.html',
			'Allow: /test.html'
		].join('\n');

		var allowed = [
			'http://www.example.com/fish',
			'http://www.example.com/fish/test.html',
			'http://www.example.com/Test.html'
		];

		var disallowed = [
			'http://www.example.com/fish/index.php',
			'http://www.example.com/fish/',
			'http://www.example.com/test.html'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should parse patterns', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /fish*.php',
			'Disallow: /*.dext$'
		].join('\n');

		var allowed = [
			'http://www.example.com/Fish.PHP',
			'http://www.example.com/Fish.dext1'
		];

		var disallowed = [
			'http://www.example.com/fish.php',
			'http://www.example.com/fishheads/catfish.php?parameters',
			'http://www.example.com/AnYthInG.dext',
			'http://www.example.com/Fish.dext.dext'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should have the correct order presidence for allow and disallow', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /fish*.php',
			'Allow: /fish/index.php',
			'Disallow: /test',
			'Allow: /test/',
		].join('\n');

		var allowed = [
			'http://www.example.com/test/index.html',
			'http://www.example.com/test/'
		];

		var disallowed = [
			'http://www.example.com/fish.php',
			'http://www.example.com/fishheads/catfish.php?parameters',
			'http://www.example.com/fish/index.php',
			'http://www.example.com/test'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should ignore rules that are not in a group', function () {
		var contents = [
			'Disallow: /secret.html',
			'Disallow: /test',
		].join('\n');

		var allowed = [
			'http://www.example.com/secret.html',
			'http://www.example.com/test/index.html',
			'http://www.example.com/test/'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, []);
	});


	it('should ignore comments', function () {
		var contents = [
			'#',
			'# This is a comment',
			'#',
			'User-agent: *',
			'# This is a comment',
			'Disallow: /fish/ # ignore',
			'# Disallow: fish',
			'Disallow: /test.html'
		].join('\n');

		var allowed = [
			'http://www.example.com/fish',
			'http://www.example.com/Test.html'
		];

		var disallowed = [
			'http://www.example.com/fish/index.php',
			'http://www.example.com/fish/',
			'http://www.example.com/test.html'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should ignore invalid lines', function () {
		var contents = [
			'invalid line',
			'User-agent: *',
			'Disallow: /fish/',
			':::::another invalid line:::::',
			'Disallow: /test.html',
			'Unknown: tule'
		].join('\n');

		var allowed = [
			'http://www.example.com/fish',
			'http://www.example.com/Test.html'
		];

		var disallowed = [
			'http://www.example.com/fish/index.php',
			'http://www.example.com/fish/',
			'http://www.example.com/test.html'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should ignore empty user-agent lines', function () {
		var contents = [
			'User-agent:',
			'Disallow: /fish/',
			'Disallow: /test.html'
		].join('\n');

		var allowed = [
			'http://www.example.com/fish',
			'http://www.example.com/Test.html',
			'http://www.example.com/fish/index.php',
			'http://www.example.com/fish/',
			'http://www.example.com/test.html'
		];

		var disallowed = [];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should support groups with multiple user agents (case insensitive)', function () {
		var contents = [
			'User-agent: agenta',
			'User-agent: agentb',
			'Disallow: /fish',
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.isAllowed("http://www.example.com/fish", "agenta")).to.equal(false);
	});

	it('should return undefined for invalid urls', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /secret.html',
			'Disallow: /test',
		].join('\n');

		var invalidUrls = [
			'http://example.com/secret.html',
			'http://www.example.net/test/index.html',
			'http://www.examsple.com/test/',
			'example.com/test/',
			':::::;;`\\|/.example.com/test/'
		];

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		invalidUrls.forEach(function (url) {
			expect(robots.isAllowed(url)).to.equal(undefined);
		});
	});

	it('should handle Unicode, urlencoded and punycode URLs', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /secret.html',
			'Disallow: /test',
		].join('\n');

		var allowed = [
			'http://www.münich.com/index.html',
			'http://www.xn--mnich-kva.com/index.html',
			'http://www.m%C3%BCnich.com/index.html'
		];

		var disallowed = [
			'http://www.münich.com/secret.html',
			'http://www.xn--mnich-kva.com/secret.html',
			'http://www.m%C3%BCnich.com/secret.html'
		];

		testRobots('http://www.münich.com/robots.txt', contents, allowed, disallowed);
		testRobots('http://www.xn--mnich-kva.com/robots.txt', contents, allowed, disallowed);
		testRobots('http://www.m%C3%BCnich.com/robots.txt', contents, allowed, disallowed);
	});

	it('should handle Unicode and urlencoded paths', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /%CF%80',
			'Disallow: /%e2%9d%83',
			'Disallow: /%a%a',
			'Disallow: /💩',
			'Disallow: /✼*t$',
			'Disallow: /%E2%9C%A4*t$',
			'Disallow: /✿%a',
			'Disallow: /http%3A%2F%2Fexample.org'
		].join('\n');

		var allowed = [
			'http://www.example.com/✼testing',
			'http://www.example.com/%E2%9C%BCtesting',
			'http://www.example.com/✤testing',
			'http://www.example.com/%E2%9C%A4testing',
			'http://www.example.com/http://example.org',
			'http://www.example.com/http:%2F%2Fexample.org'
		];

		var disallowed = [
			'http://www.example.com/%CF%80',
			'http://www.example.com/%CF%80/index.html',
			'http://www.example.com/π',
			'http://www.example.com/π/index.html',
			'http://www.example.com/%e2%9d%83',
			'http://www.example.com/%E2%9D%83/index.html',
			'http://www.example.com/❃',
			'http://www.example.com/❃/index.html',
			'http://www.example.com/%F0%9F%92%A9',
			'http://www.example.com/%F0%9F%92%A9/index.html',
			'http://www.example.com/💩',
			'http://www.example.com/💩/index.html',
			'http://www.example.com/%a%a',
			'http://www.example.com/%a%a/index.html',
			'http://www.example.com/✼test',
			'http://www.example.com/%E2%9C%BCtest',
			'http://www.example.com/✤test',
			'http://www.example.com/%E2%9C%A4testt',
			'http://www.example.com/✿%a',
			'http://www.example.com/%E2%9C%BF%atest',
			'http://www.example.com/http%3A%2F%2Fexample.org'
		];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should handle lone high / low surrogates', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /\uD800',
			'Disallow: /\uDC00'
		].join('\n');

		// These are invalid so can't be disallowed
		var allowed = [
			'http://www.example.com/\uDC00',
			'http://www.example.com/\uD800'
		];

		var disallowed = [];

		testRobots('http://www.example.com/robots.txt', contents, allowed, disallowed);
	});

	it('should ignore host case', function () {
		var contents = [
			'User-agent: *',
			'Disallow: /secret.html',
			'Disallow: /test',
		].join('\n');

		var allowed = [
			'http://www.example.com/index.html',
			'http://www.ExAmPlE.com/index.html',
			'http://www.EXAMPLE.com/index.html'
		];

		var disallowed = [
			'http://www.example.com/secret.html',
			'http://www.ExAmPlE.com/secret.html',
			'http://www.EXAMPLE.com/secret.html'
		];

		testRobots('http://www.eXample.com/robots.txt', contents, allowed, disallowed);
	});

	it('should allow all if empty robots.txt', function () {
		var allowed = [
			'http://www.example.com/secret.html',
			'http://www.example.com/test/index.html',
			'http://www.example.com/test/'
		];

		var robots = robotsParser('http://www.example.com/robots.txt', '');

		allowed.forEach(function (url) {
			expect(robots.isAllowed(url)).to.equal(true);
		});
	});

	it('should treat null as allowing all', function () {
		var robots = robotsParser('http://www.example.com/robots.txt', null);

		expect(robots.isAllowed("http://www.example.com/", "userAgent")).to.equal(true);
		expect(robots.isAllowed("http://www.example.com/")).to.equal(true);
	});

	it('should handle invalid robots.txt urls', function () {
		var contents = [
			'user-agent: *',
			'disallow: /',

			'host: www.example.com',
			'sitemap: /sitemap.xml'
		].join('\n');

		var sitemapUrls = [
			undefined,
			null,
			'null',
			':/wom/test/'
		];

		sitemapUrls.forEach(function (url) {
			var robots = robotsParser(url, contents);
			expect(robots.isAllowed('http://www.example.com/index.html')).to.equal(undefined);
			expect(robots.getPreferredHost()).to.equal('www.example.com');
			expect(robots.getSitemaps()).to.eql(['/sitemap.xml']);
		});
	});

	it('should parse the crawl-delay directive', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1',

			'user-agent: b',
			'disallow: /d',

			'user-agent: c',
			'user-agent: d',
			'crawl-delay: 10'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getCrawlDelay('a')).to.equal(1);
		expect(robots.getCrawlDelay('b')).to.equal(undefined);
		expect(robots.getCrawlDelay('c')).to.equal(10);
		expect(robots.getCrawlDelay('d')).to.equal(10);
		expect(robots.getCrawlDelay()).to.equal(undefined);
	});

	it('should ignore invalid crawl-delay directives', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1.2.1',

			'user-agent: b',
			'crawl-delay: 1.a0',

			'user-agent: c',
			'user-agent: d',
			'crawl-delay: 10a'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getCrawlDelay('a')).to.equal(undefined);
		expect(robots.getCrawlDelay('b')).to.equal(undefined);
		expect(robots.getCrawlDelay('c')).to.equal(undefined);
		expect(robots.getCrawlDelay('d')).to.equal(undefined);
	});

	it('should parse the sitemap directive', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1',
			'sitemap: http://example.com/test.xml',

			'user-agent: b',
			'disallow: /d',

			'sitemap: /sitemap.xml',
			'sitemap:     http://example.com/test/sitemap.xml     '
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getSitemaps()).to.eql([
			'http://example.com/test.xml',
			'/sitemap.xml',
			'http://example.com/test/sitemap.xml'
		]);
	});

	it('should parse the host directive', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1',
			'host: www.example.net',

			'user-agent: b',
			'disallow: /d',

			'host: example.com'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getPreferredHost()).to.equal('example.com');
	});

	it('should parse empty and invalid directives', function () {
		var contents = [
			'user-agent:',
			'user-agent:::: a::',
			'crawl-delay:',
			'crawl-delay:::: 0:',
			'host:',
			'host:: example.com',
			'sitemap:',
			'sitemap:: site:map.xml',
			'disallow:',
			'disallow::: /:',
			'allow:',
			'allow::: /:',
		].join('\n');

		robotsParser('http://www.example.com/robots.txt', contents);
	});

	it('should treat only the last host directive as valid', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1',
			'host: www.example.net',

			'user-agent: b',
			'disallow: /d',

			'host: example.net',
			'host: example.com'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getPreferredHost()).to.equal('example.com');
	});

	it('should return null when there is no host directive', function () {
		var contents = [
			'user-agent: a',
			'crawl-delay: 1',

			'user-agent: b',
			'disallow: /d',
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getPreferredHost()).to.equal(null);
	});

	it('should fallback to * when a UA has no rules of its own', function () {
		var contents = [
			'user-agent: *',
			'crawl-delay: 1',

			'user-agent: b',
			'crawl-delay: 12',

			'user-agent: c',
			'user-agent: d',
			'crawl-delay: 10'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getCrawlDelay('should-fall-back')).to.equal(1);
		expect(robots.getCrawlDelay('d')).to.equal(10);
		expect(robots.getCrawlDelay('dd')).to.equal(1);
	});

	it('should not fallback to * when a UA has rules', function () {
		var contents = [
			'user-agent: *',
			'crawl-delay: 1',

			'user-agent: b',
			'disallow:'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getCrawlDelay('b')).to.equal(undefined);
	});

	it('should ignore version numbers in the UA string', function () {
		var contents = [
			'user-agent: *',
			'crawl-delay: 1',

			'user-agent: b',
			'crawl-delay: 12',

			'user-agent: c',
			'user-agent: d',
			'crawl-delay: 10'
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getCrawlDelay('should-fall-back/1.0.0')).to.equal(1);
		expect(robots.getCrawlDelay('d/12')).to.equal(10);
		expect(robots.getCrawlDelay('dd / 0-32-3')).to.equal(1);
		expect(robots.getCrawlDelay('b / 1.0')).to.equal(12);
	});


	it('should return the line number of the matching directive', function () {
		var contents = [
			'',
			'User-agent: *',
			'',
			'Disallow: /fish/',
			'Disallow: /test.html',
			'Allow: /fish/test.html',
			'Allow: /test.html',
			'',
			'User-agent: a',
			'allow: /',
			'',
			'User-agent: b',
			'disallow: /test',
			'disallow: /t*t',
			// check UA returns -1 if no matching UA and also handles patterns both allow and disaloow
		].join('\n');

		var robots = robotsParser('http://www.example.com/robots.txt', contents);

		expect(robots.getMatchingLineNumber('http://www.example.com/fish')).to.equal(-1);
		expect(robots.getMatchingLineNumber('http://www.example.com/fish/test.html')).to.equal(6);
		expect(robots.getMatchingLineNumber('http://www.example.com/Test.html')).to.equal(-1);

		expect(robots.getMatchingLineNumber('http://www.example.com/fish/index.php')).to.equal(4);
		expect(robots.getMatchingLineNumber('http://www.example.com/fish/')).to.equal(4);
		expect(robots.getMatchingLineNumber('http://www.example.com/test.html')).to.equal(5);

		expect(robots.getMatchingLineNumber('http://www.example.com/test.html', 'a')).to.equal(10);
		expect(robots.getMatchingLineNumber('http://www.example.com/test.html', 'b')).to.equal(14);
	});
});

