# Lighthouse  [![Linux Build Status](https://img.shields.io/travis/GoogleChrome/lighthouse/master.svg)](https://travis-ci.org/GoogleChrome/lighthouse) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/46a5yoqc3hk59bl5/branch/master?svg=true)](https://ci.appveyor.com/project/paulirish/lighthouse/branch/master) [![Coverage Status](https://img.shields.io/coveralls/GoogleChrome/lighthouse/master.svg)](https://coveralls.io/github/GoogleChrome/lighthouse?branch=master) [![NPM lighthouse package](https://img.shields.io/npm/v/lighthouse.svg)](https://npmjs.org/package/lighthouse)

> Lighthouse analyzes web apps and web pages, collecting modern performance metrics and insights on developer best practices.

## Using Lighthouse in Chrome DevTools

Lighthouse is integrated directly into the Chrome Developer Tools, under the "Audits" panel.

**Installation**: install [Chrome](https://www.google.com/chrome/browser).

**Run it**: open Chrome DevTools, select the Audits panel, and hit "Run audits".

<img src="https://raw.githubusercontent.com/GoogleChrome/lighthouse/e7997b3db01de3553d8cb208a40f3d4fd350195c/assets/example_dev_tools.png" alt="Lighthouse integration in Chrome DevTools" width="500px">

## Using the Chrome extension

The Chrome extension was available prior to Lighthouse being available in Chrome Developer Tools, and offers similar functionality.

**Installation**: [install the extension](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk) from the Chrome Web Store.

**Run it**: follow the [extension quick-start guide](https://developers.google.com/web/tools/lighthouse/#extension).

## Using the Node CLI

The Node CLI provides the most flexibility in how Lighthouse runs can be configured and reported. Users who want more advanced usage, or want to run Lighthouse in an automated fashion should use the Node CLI.

_Lighthouse requires Node 10 LTS (10.13) or later._

**Installation**:

```sh
npm install -g lighthouse
# or use yarn:
# yarn global add lighthouse
```

**Run it**: `lighthouse https://airhorner.com/`

By default, Lighthouse writes the report to an HTML file. You can control the output format by passing flags.

### CLI options

```
$ lighthouse --help

lighthouse <url>

Logging:
  --verbose  Displays verbose logging                                                                                                      [boolean]
  --quiet    Displays no progress, debug logs or errors                                                                                    [boolean]

Configuration:
  --save-assets                  Save the trace & devtools log to disk                                                                     [boolean]
  --list-all-audits              Prints a list of all available audits and exits                                                           [boolean]
  --list-trace-categories        Prints a list of all required trace categories and exits                                                  [boolean]
  --print-config                 Print the normalized config for the given config and options, then exit.                                  [boolean]
  --additional-trace-categories  Additional categories to capture with the trace (comma-delimited).
  --config-path                  The path to the config JSON.
                                 An example config file: lighthouse-core/config/lr-desktop-config.js
  --chrome-flags                 Custom flags to pass to Chrome (space-delimited). For a full list of flags, see
                                 http://peter.sh/experiments/chromium-command-line-switches/.

                                 Environment variables:
                                 CHROME_PATH: Explicit path of intended Chrome binary. If set must point to an executable of a build of
                                 Chromium version 66.0 or later. By default, any detected Chrome Canary or Chrome (stable) will be launched.
                                                                                                                                       [default: ""]
  --port                         The port to use for the debugging protocol. Use 0 for a random port                                    [default: 0]
  --preset                       Use a built-in configuration.                                            [choices: "full", "perf", "mixed-content"]
                                 WARNING: If the --config-path flag is provided, this preset will be ignored.
  --hostname                     The hostname to use for the debugging protocol.                                              [default: "localhost"]
  --max-wait-for-load            The timeout (in milliseconds) to wait before the page is considered done loading and the run should continue.
                                 WARNING: Very high values can lead to large traces and instability                                 [default: 45000]
  --emulated-form-factor         Controls the emulated device form factor (mobile vs. desktop) if not disabled                      [choices: "mobile", "desktop", "none"] [default: "mobile"]
  --enable-error-reporting       Enables error reporting, overriding any saved preference. --no-enable-error-reporting will do the opposite. More:
                                 https://git.io/vFFTO
  --gather-mode, -G              Collect artifacts from a connected browser and save to disk. If audit-mode is not also enabled, the run will quit
                                 early.                                                                                                    [boolean]
  --audit-mode, -A               Process saved artifacts from disk                                                                         [boolean]

Output:
  --output       Reporter for the results, supports multiple values                        [choices: "json", "html", "csv"] [default: "html"]
  --output-path  The file path to output the results. Use 'stdout' to write to stdout.
                 If using JSON output, default is stdout.
                 If using HTML or CSV output, default is a file in the working directory with a name based on the test URL and date.
                 If using multiple outputs, --output-path is appended with the standard extension for each output type. "reports/my-run" -> "reports/my-run.report.html", "reports/my-run.report.json", etc.
                 Example: --output-path=./lighthouse-results.html
  --view         Open HTML report in your browser                                                                                          [boolean]

Options:
  --help                        Show help                                                                                                  [boolean]
  --version                     Show version number                                                                                        [boolean]
  --cli-flags-path              The path to a JSON file that contains the desired CLI flags to apply.
                                Flags specified at the command line will still override the file-based ones.
  --blocked-url-patterns        Block any network requests to the specified URL patterns                                                     [array]
  --disable-storage-reset       Disable clearing the browser cache and other storage APIs before a run                                     [boolean]
  --throttling-method                  Controls throttling method         [choices: "devtools", "provided", "simulate"]
  --throttling.rttMs                   Controls simulated network RTT (TCP layer)
  --throttling.throughputKbps          Controls simulated network download throughput
  --throttling.requestLatencyMs        Controls emulated network RTT (HTTP layer)
  --throttling.downloadThroughputKbps  Controls emulated network download throughput
  --throttling.uploadThroughputKbps    Controls emulated network upload throughput
  --throttling.cpuSlowdownMultiplier   Controls simulated + emulated CPU throttling
  --extra-headers               Set extra HTTP Headers to pass with request                                                                 [string]

Examples:
  lighthouse <url> --view                                                   Opens the HTML report in a browser after the run completes
  lighthouse <url> --config-path=./myconfig.js                              Runs Lighthouse with your own configuration: custom audits, report
                                                                            generation, etc.
  lighthouse <url> --output=json --output-path=./report.json --save-assets  Save trace, devtoolslog, and named JSON report.
  lighthouse <url> --emulated-form-factor=none                              Disable device emulation and all throttling.
    --throttling-method=provided
  lighthouse <url> --chrome-flags="--window-size=412,660"                   Launch Chrome with a specific window size
  lighthouse <url> --quiet --chrome-flags="--headless"                      Launch Headless Chrome, turn off logging
  lighthouse <url> --extra-headers "{\"Cookie\":\"monster=blue\"}"          Stringify\'d JSON HTTP Header key/value pairs to send in requests
  lighthouse <url> --extra-headers=./path/to/file.json                      Path to JSON file of HTTP Header key/value pairs to send in requests
  lighthouse <url> --only-categories=performance,pwa                        Only run the specified categories. Available categories: accessibility,
                                                                            best-practices, performance, pwa, seo.

For more information on Lighthouse, see https://developers.google.com/web/tools/lighthouse/.
```

##### Output Examples

```sh
lighthouse
# saves `./<HOST>_<DATE>.report.html`

lighthouse --output json
# json output sent to stdout

lighthouse --output html --output-path ./report.html
# saves `./report.html`

# NOTE: specifying an output path with multiple formats ignores your specified extension for *ALL* formats
lighthouse --output json --output html --output-path ./myfile.json
# saves `./myfile.report.json` and `./myfile.report.html`

lighthouse --output json --output html
# saves `./<HOST>_<DATE>.report.json` and `./<HOST>_<DATE>.report.html`

lighthouse --output-path=~/mydir/foo.out --save-assets
# saves `~/mydir/foo.report.html`
# saves `~/mydir/foo-0.trace.json` and `~/mydir/foo-0.devtoolslog.json`

lighthouse --output-path=./report.json --output json
# saves `./report.json`
```

##### Lifecycle Examples
You can run a subset of Lighthouse's lifecycle if desired via the `--gather-mode` (`-G`) and  `--audit-mode` (`-A`) CLI flags.

```sh
lighthouse http://example.com -G
# launches browser, collects artifacts, saves them to disk (in `./latest-run/`) and quits

lighthouse http://example.com -A
# skips browser interaction, loads artifacts from disk (in `./latest-run/`), runs audits on them, generates report

lighthouse http://example.com -GA
# Normal gather + audit run, but also saves collected artifacts to disk for subsequent -A runs.


# You can optionally provide a custom folder destination to -G/-A/-GA. Without a value, the default will be `$PWD/latest-run`.
lighthouse -GA=./gmailartifacts https://gmail.com
```


#### Notes on Error Reporting

The first time you run the CLI you will be prompted with a message asking you if Lighthouse can anonymously report runtime exceptions. The Lighthouse team uses this information to detect new bugs and avoid regressions. Opting out will not affect your ability to use Lighthouse in any way. [Learn more](https://github.com/GoogleChrome/lighthouse/blob/master/docs/error-reporting.md).

## Using the Node module
You can also use Lighthouse programmatically with the Node module.

Read [Using Lighthouse programmatically](./docs/readme.md#using-programmatically) for help getting started.\
Read [Lighthouse Configuration](./docs/configuration.md) to learn more about the configuration options available.

## Viewing a report

Lighthouse can produce a report as JSON or HTML.

HTML report:

<img src="https://raw.githubusercontent.com/GoogleChrome/lighthouse/443ff2c8a297dfd2297dfaca86c4966a87c8574a/assets/example_audit.png" alt="Lighthouse example audit" width="500px">

### Online Viewer

Running Lighthouse with the `--output=json` flag generates a JSON dump of the run.
You can view this report online by visiting <https://googlechrome.github.io/lighthouse/viewer/>
and dragging the file onto the app. You can also use the "Export" button from the
top of any Lighthouse HTML report and open the report in the
[Lighthouse Viewer](https://googlechrome.github.io/lighthouse/viewer/).

In the Viewer, reports can be shared by clicking the share icon in the top
right corner and signing in to GitHub.

> **Note**: shared reports are stashed as a secret Gist in GitHub, under your account.

## Docs & Recipes

Useful documentation, examples, and recipes to get you started.

**Docs**

- [Dealing with variance](./docs/variability.md)
- [Using Lighthouse programmatically](./docs/readme.md#using-programmatically)
- [Testing a site with authentication](./docs/authenticated-pages.md)
- [Developing Plugins](./docs/plugins.md)
- [Testing on a mobile device](./docs/readme.md#testing-on-a-mobile-device)
- [Lighthouse Architecture](./docs/architecture.md)

**Recipes**

- [gulp](docs/recipes/gulp) - helpful for CI integration
- [Plugin](./docs/recipes/lighthouse-plugin-example) - example Lighthouse plugin
- [Custom Audit example](./docs/recipes/custom-audit) - extend Lighthouse, run your own audits

**Videos**

The session from Google I/O 2018 covers the new performance engine, upcoming Lighthouse REST API, and using the Chrome UX report to evaluate real-user data.

[![Lighthouse @ Google I/O 2018](https://img.youtube.com/vi/UvK9zAsSM8Q/0.jpg)](https://www.youtube.com/watch?v=UvK9zAsSM8Q)

The session from Google I/O 2017 covers architecture, writing custom audits,
GitHub/Travis/CI integration, headless Chrome, and more:

[![Lighthouse @ Google I/O 2017](https://img.youtube.com/vi/NoRYn6gOtVo/0.jpg)](https://www.youtube.com/watch?v=NoRYn6gOtVo)

_click to watch the video_

## Develop

Read on for the basics of hacking on Lighthouse. Also, see [Contributing](./CONTRIBUTING.md)
for detailed information.

### Setup

```sh
# yarn should be installed first

git clone https://github.com/GoogleChrome/lighthouse

cd lighthouse
yarn
yarn build-all
```

If changing audit output, you'll likely also need to have the protocol-buffer compiler installed. See the [official installation instructions](https://github.com/protocolbuffers/protobuf#protocol-compiler-installation) or consult your [favorite package manager](https://formulae.brew.sh/formula/protobuf) for your OS.

### Run

```sh
node lighthouse-cli http://example.com
# append --chrome-flags="--no-sandbox --headless --disable-gpu" if you run into problems connecting to Chrome
```

> **Getting started tip**: `node --inspect-brk lighthouse-cli http://example.com` to open up Chrome DevTools and step
through the entire app. See [Debugging Node.js with Chrome
DevTools](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27#.59rma3ukm)
for more info.

### Tests

```sh
# lint and test all files
yarn test

# watch for file changes and run tests
#   Requires http://entrproject.org : brew install entr
yarn watch

## run linting, unit, and smoke tests separately
yarn lint
yarn unit
yarn smoke

## run tsc compiler
yarn type-check
```

## Lighthouse Integrations
This section details services that have integrated Lighthouse data. If you're working on a cool project integrating Lighthouse and would like to be featured here, file an issue to this repo or tweet at us [@_____lighthouse](https://twitter.com/____lighthouse?lang=en)!

* **[Calibre](https://calibreapp.com)** - Calibre is a web performance monitoring tool running Lighthouse continuously or on-demand via an API. Test using emulated devices and connection speeds from a number of geographical locations. Set budgets and improve performance with actionable guidelines. Calibre comes with a free 14-day trial.

* **[DebugBear](https://www.debugbear.com/)** - DebugBear is a website monitoring tool based on Lighthouse. See how your scores and metrics changed over time, with a focus on understanding what caused each change. DebugBear is a paid product with a free 30-day trial.

* **[Fluxguard](https://fluxguard.com/)** - Fluxguard provides website DOM change monitoring orchestrated with Google Puppeteer, and audited by Lighthouse. Fluxguard is a freemium product, with monthly monitoring of up to 75 pages for free.

* **[Foo](https://www.foo.software)** - Foo continuously monitors performance with Lighthouse and provides a timeline chart by day, week, or month. Users can receive alerts via email, Slack, and PagerDuty. Foo offers free and paid products.

* **[HTTPArchive](http://httparchive.org/)** - HTTPArchive tracks how the web is built by crawling 500k pages with Web Page Test, including Lighthouse results, and stores the information in BigQuery where it is [publicly available](https://discuss.httparchive.org/t/quickstart-guide-to-exploring-the-http-archive/682).

* **[Lighthouse Keeper](https://lighthouse-keeper.com/)** - Lighthouse Keeper monitors your pages' Lighthouse scores and notifies you if they drop below your thresholds. Lighthouse Keeper is a free service that monitors up to 3 URLs once per day.

* **[SpeedCurve](https://speedcurve.com)** — SpeedCurve is a tool for continuously monitoring web performance across different browsers, devices, and regions. It can aggregate any metric including Lighthouse scores across multiple pages and sites, and allows you to set performance budgets with Slack or email alerts. SpeedCurve is a paid product with a free 30-day trial.

* **[Speedrank](https://speedrank.app)** - Speedrank monitors the performance of your website in the background. It displays Lighthouse reports over time and delivers recommendations for improvement. Speedrank is a paid product with 14-day-trial.

* **[Treo](https://treo.sh)** - Treo is Lighthouse as a Service. It provides regression testing, geographical regions, custom networks, and integrations with GitHub & Slack. Treo is a paid product with plans for solo-developers and teams.

* **[Web Page Test](https://www.webpagetest.org)** — An [open source](https://github.com/WPO-Foundation/webpagetest) tool for measuring and analyzing the performance of web pages on real devices. Users can choose to produce a Lighthouse report alongside the analysis of WebPageTest results.

* **[is-website-vulnerable](https://github.com/lirantal/is-website-vulnerable)** - An open source Node.js CLI tool that finds publicly known security vulnerabilities in a website's frontend JavaScript libraries.

## Plugins

* **[lighthouse-plugin-field-performance](https://github.com/treosh/lighthouse-plugin-field-performance)** - a plugin that adds real-user performance metrics for the URL using the data from [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report/).

## Related Projects
Other awesome open source projects that use Lighthouse.

* **[Exthouse](https://github.com/treosh/exthouse)** - Analyze the impact of a browser extension on web performance.
* **[Garie](https://github.com/boyney123/garie)** - An open source tool for monitoring performance using Lighthouse,  PageSpeed Insights, [Prometheus](https://prometheus.io/), [Grafana](https://grafana.com/) and [Docker](https://www.docker.com/).
* **[Gimbal](https://labs.moduscreate.com/gimbal-web-performance-audit-budgeting)** - An [open source (MIT licensed)](https://github.com/ModusCreateOrg/gimbal) tool used to measure, analyze, and budget aspects of a web application. Gimbal also integrates reports with GitHub pull requests.
* **[Gradle Lighthouse Plugin](https://github.com/Cognifide/gradle-lighthouse-plugin)** - An open source Gradle plugin that runs Lighthouse tests on multiple URLs and asserts category score thresholds (useful in continuous integration).
* **[lightcrawler](https://github.com/github/lightcrawler)** - Crawl a website and run each page found through Lighthouse.
* **[lighthouse-badges](https://github.com/emazzotta/lighthouse-badges)** - Generate gh-badges (shields.io) based on Lighthouse performance.
* **[lighthouse-batch](https://www.npmjs.com/package/lighthouse-batch)** - Run Lighthouse over a number of sites and generate a summary of their metrics/scores.
* **[lighthouse-check-action](https://github.com/foo-software/lighthouse-check-action)** - A Github Action to run Lighthouse in a workflow, featuring Slack notifications and report upload to S3.
* **[lighthouse-check-orb](https://circleci.com/orbs/registry/orb/foo-software/lighthouse-check)** - A CircleCI Orb to run Lighthouse in a workflow, featuring Slack notifications and report upload to S3.
* **[lighthouse-ci](https://github.com/andreasonny83/lighthouse-ci)** - Run Lighthouse and assert scores satisfy your custom thresholds.
* **[lighthouse-ci-action](https://github.com/treosh/lighthouse-ci-action)** - A Github Action that makes it easy to run Lighthouse in CI and keep your pages small using performance budgets.
* **[lighthouse-cron](https://github.com/thearegee/lighthouse-cron)** - Cron multiple batch Lighthouse audits and emit results for sending to remote server.
* **[lighthouse-gh-reporter](https://github.com/carlesnunez/lighthouse-gh-reporter)** - Run Lighthouse in CI and report back in a comment on your pull requests
* **[lighthouse-hue](https://github.com/ebidel/lighthouse-hue)** - Set the color of Philips Hue lights based on a Lighthouse score
* **[lighthouse-jest-example](https://github.com/justinribeiro/lighthouse-jest-example)** - Gather performance metrics via Lighthouse and assert results with Jest; uses Puppeteer to start Chrome with network emulation settings defined by WebPageTest.
* **[lighthouse-lambda](https://github.com/joytocode/lighthouse-lambda)** - Run Lighthouse on AWS Lambda with prebuilt stable desktop Headless Chrome.
* **[lighthouse-magic-light](https://github.com/manekinekko/lighthouse-magic-light)** - Set the color of the MagicLight Bluetooth Smart Light Bulb based on Lighthouse score
* **[lighthouse-mocha-example](https://github.com/rishichawda/lighthouse-mocha-example)** - Run Lighthouse performance tests with Mocha and chrome-launcher.
* **[lighthouse-monitor](https://github.com/verivox/lighthouse-monitor)** - Run Lighthouse against all your URLs. Send metrics to any backend you want, save all reports with automatic data retention, and compare any two results in a web UI.
* **[lighthouse-persist](https://github.com/foo-software/lighthouse-persist)** - Run Lighthouse and upload HTML reports to an AWS S3 bucket.
* **[lighthouse4u](https://github.com/godaddy/lighthouse4u)** - LH4U provides Google Lighthouse as a service, surfaced by both a friendly UI+API, and backed by Elastic Search for easy querying and visualization.
* **[performance-budgets](https://performance-budgets.netlify.com/)** - Easily assert Lighthouse budgets with Docker.
* **[pwmetrics](https://github.com/paulirish/pwmetrics/)** - Gather performance metrics
* **[react-lighthouse-viewer](https://www.npmjs.com/package/react-lighthouse-viewer)** - Render a Lighthouse JSON report in a React Component.
* **[webpack-lighthouse-plugin](https://github.com/addyosmani/webpack-lighthouse-plugin)** - Run Lighthouse from a Webpack build.

## FAQ

### How does Lighthouse work?

See [Lighthouse Architecture](./docs/architecture.md).

### Can I configure the lighthouse run?

Yes! Details in [Lighthouse configuration](./docs/configuration.md).

### How does Lighthouse use network throttling, and how can I make it better?

Good question. Network and CPU throttling are applied by default in a Lighthouse run. The network
attempts to emulate slow 4G connectivity and the CPU is slowed down 4x from your machine's default speed. If you
prefer to run Lighthouse without throttling, you'll have to use the CLI and disable it with the
`--throttling.*` flags mentioned above.

Read more in our [guide to network throttling](./docs/throttling.md).

### Are results sent to a remote server?

Nope. Lighthouse runs locally, auditing a page using a local version of the Chrome browser installed the
machine. Report results are never processed or beaconed to a remote server.

### How do I author custom audits to extend Lighthouse?

> **Tip**: see [Lighthouse Architecture](./docs/architecture.md) for more information
on terminology and architecture.

Lighthouse can be extended to run custom audits and gatherers that you author.
This is great if you're already tracking performance metrics in your site and
want to surface those metrics within a Lighthouse report.

If you're interested in running your own custom audits, check out our
[Custom Audit Example](./docs/recipes/custom-audit) over in recipes.

### How do I contribute?

We'd love help writing audits, fixing bugs, and making the tool more useful!
See [Contributing](./CONTRIBUTING.md) to get started.

---
<p align="center">
  <img src="https://raw.githubusercontent.com/GoogleChrome/lighthouse/8b3d7f052b2e64dd857e741d7395647f487697e7/assets/lighthouse-logo.png" alt="Lighthouse logo" height="150">
  <br>
  <b>Lighthouse</b>, ˈlītˌhous (n): a <s>tower or other structure</s> tool containing a beacon light
  to warn or guide <s>ships at sea</s> developers.
</p>
