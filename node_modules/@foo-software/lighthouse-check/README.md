[![CircleCI](https://circleci.com/gh/foo-software/lighthouse-check.svg?style=svg)](https://circleci.com/gh/foo-software/lighthouse-check)

# `@foo-software/lighthouse-check`

> An NPM module and CLI to run Lighthouse audits programmatically. This project aims to add bells and whistles to automated Lighthouse testing for DevOps workflows. Easily implement in your Continuous Integration or Continuous Delivery pipeline.

<img src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-audit-report.png" />

This project provides **two ways of running audits** - locally in your own environment or remotely via [Foo's Automated Lighthouse Check](https://www.foo.software/lighthouse) API. For basic usage, running locally will suffice, but if you'd like to maintain a historical record of Lighthouse audits and utilize other features, you can run audits remotely by following the [steps and examples](#foo-api-usage).

# Features

- [Simple usage](#basic-usage) - only one parameter required.
- Run **multiple** Lighthouse audits with one command.
- Optionally run Lighthouse remotely and save audits with the [Foo's Automated Lighthouse Check](https://www.foo.software/lighthouse) API.
- Optionally [save an HTML report locally](#saving-reports-locally).
- Optionally [save an HTML report in an AWS S3 bucket](#saving-reports-to-s3).
- [Easy setup with Slack Webhooks](#implementing-with-slack). Just add your Webhook URL and `lighthouse-check` will send results and optionally include versioning data like branch, author, PR, etc (typically from GitHub).
- PR comments of audit scores.
- NPM module for programmatic [usage](#basic-usage).
- CLI - see [CLI Usage](#cli-usage).
- Docker - see [Docker Usage](#docker).
- Support for implementations like [CircleCI](#implementing-with-circleci).

# Table of Contents

- [Install](#install)
- [Usage](#usage)
  - [Basic Usage](#basic-usage)
  - [Foo's Automated Lighthouse Check API Usage](#foos-automated-lighthouse-check-api-usage)
  - [Saving Reports Locally](#saving-reports-locally)
  - [Saving Reports to S3](#saving-reports-to-s3)
  - [Implementing with Slack](#implementing-with-slack)
  - [Enabling PR Comments](#enabling-pr-comments)
  - [Enforcing Minimum Scores](#enforcing-minimum-scores)
  - [Implementing with CircleCI](#implementing-with-circleci)
  - [Implementing with GitHub Actions](#implementing-with-gitHub-actions)
- [CLI](#cli)
- [Docker](#docker)
- [Options](#options)

# Install

```bash
npm install @foo-software/lighthouse-check
```

# Usage

`@foo-software/lighthouse-check` provides several functionalities beyond standard Lighthouse audits. It's recommended to start with a basic implementation and expand on it as needed.

## Basic Usage

Calling `lighthouseCheck` will run Lighthouse audits against `https://www.foo.software/lighthouse` and `https://www.foo.software/contact`.

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    urls: [
      'https://www.foo.software/lighthouse',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact"
```

The CLI will log the results.

<img alt="lighthouse-check CLI output" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-cli-output.jpg" width="600" />

## Foo's Automated Lighthouse Check API Usage

[Foo's Automated Lighthouse Check](https://www.foo.software/lighthouse) can monitor your website's quality by running audits automatically! It can provide a historical record of audits over time to track progression and degradation of website quality. [Create a free account](https://www.foo.software/lighthouse/register) to get started. With this, not only will you have automatic audits, but also any that you trigger additionally. Below are steps to trigger audits on URLs that you've created in your account.

#### Trigger Audits on All Pages in an Account

- Navigate to [your account details](https://www.foo.software/lighthouse/account), click into "Account Management" and make note of the "API Token".
- Use the account token as the [`apiToken` option](#options).

> Basic example with the CLI

```bash
$ lighthouse-check --apiToken "abcdefg"
```

#### Trigger Audits on Only Certain Pages in an Account

- Navigate to [your account details](https://www.foo.software/lighthouse/account), click into "Account Management" and make note of the "API Token".
- Navigate to [your dashboard](https://www.foo.software/lighthouse/dashboard) and once you've created URLs to monitor, click on the "More" link of the URL you'd like to use. From the URL details screen, click the "Edit" link at the top of the page. You should see an "API Token" on this page. It represents the token for this specific page (not to be confused with an **account** API token).
- Use the account token as the [`apiToken` option](#options) and page token (or group of page tokens) as [`urls` option](#options).

> Basic example with the CLI

```bash
$ lighthouse-check --apiToken "abcdefg" \
  --urls "hijklmnop,qrstuv"
```

You can combine usage with other options for a more advanced setup. Example below.

> Runs audits remotely and posts results as comments in a PR

```bash
$ lighthouse-check --apiToken "abcdefg" \
  --urls "hijklmnop,qrstuv" \
  --prCommentAccessToken "abcpersonaltoken" \
  --prCommentUrl "https://api.github.com/repos/foo-software/lighthouse-check/pulls/3/reviews"
```

## Saving Reports Locally

You may notice above we had two lines of output; `Report` and `Local Report`. These values are populated when options are provided to save the report locally and to S3. These options are not required and can be used together or alone.

Saving a report locally example below.

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    // relative to the file. NOTE: when using the CLI `--outputDirectory` is relative
    // to where the command is being run from.
    outputDirectory: '../artifacts',
    urls: [
      'https://www.foo.software/lighthouse',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact" \
  --ouputDirectory "./artifacts"
```

## Saving Reports to S3

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    awsAccessKeyId: 'abc123',
    awsBucket: 'my-bucket',
    awsRegion: 'us-east-1',
    awsSecretAccessKey: 'def456',
    urls: [
      'https://www.foo.software/lighthouse',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact" \
  --awsAccessKeyId abc123 \
  --awsBucket my-bucket \
  --awsRegion us-east-1 \
  --awsSecretAccessKey def456 \
```

## Implementing with Slack

Below is a basic Slack implementation. To see how you can accomplish notifications with code versioning data - see the [CircleCI example](#implementing-with-circleci) (ie GitHub authors, PRs, branches, etc).

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    slackWebhookUrl: 'https://www.my-slack-webhook-url.com'
    urls: [
      'https://www.foo.software/lighthouse',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact" \
  --slackWebhookUrl "https://www.my-slack-webhook-url.com"
```

The below screenshot shows an advanced implementation as detailed in the [CircleCI example](#implementing-with-circleci).

<img alt="Lighthouse Check Slack notification" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-slack.png" width="600" />

## Enabling PR Comments

Populate [`prCommentAccessToken` and `prCommentUrl` options](#options) to enable comments on pull requests.

<img alt="Lighthouse Check PR comments" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-check-pr-comment.png" width="400">

## Enforcing Minimum Scores

You can use `validateStatus` to enforce minimum scores. This could be handy in a DevOps workflow for example.

```javascript
import { lighthouseCheck, validateStatus } from '@foo-software/lighthouse-check';

(async () => {
  try {
    const response = await lighthouseCheck({
      awsAccessKeyId: 'abc123',
      awsBucket: 'my-bucket',
      awsRegion: 'us-east-1',
      awsSecretAccessKey: 'def456',
      urls: [
        'https://www.foo.software/lighthouse',
        'https://www.foo.software/contact'
      ]
    });

    const status = await validateStatus({
      minAccessibilityScore: 90,
      minBestPracticesScore: 90,
      minPerformanceScore: 70,
      minProgressiveWebAppScore: 70,
      minSeoScore: 80,
      results: response
    });

    console.log('all good?', status); // 'all good? true'
  } catch (error) {
    console.log('error', error.message);

    // log would look like:
    // Minimum score requirements failed:
    // https://www.foo.software/lighthouse: Performance: minimum score: 70, actual score: 64
    // https://www.foo.software/contact: Performance: minimum score: 70, actual score: 44
  }
})();
```

Or via CLI. **Important**: `outputDirectory` value must be defined and the same in both commands.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact" \
  --outputDirectory /tmp/artifacts \
$ lighthouse-check-status --outputDirectory /tmp/artifacts \
  --minAccessibilityScore 90 \
  --minBestPracticesScore 90 \
  --minPerformanceScore 70 \
  --minProgressiveWebAppScore 70 \
  --minSeoScore 80
```

## Implementing with CircleCI

In the below example we run Lighthouse audits on two URLs, save reports as artifacts, deploy reports to S3 and send a Slack notification with GitHub info. We defined environment variables like `LIGHTHOUSE_CHECK_AWS_BUCKET` in the [CircleCI project settings](https://circleci.com/docs/2.0/settings/#project-settings-page).

This implementation utilizes a CircleCI Orb - [lighthouse-check-orb](https://circleci.com/orbs/registry/orb/foo-software/lighthouse-check).

```yaml
version: 2.1

orbs:
  lighthouse-check: foo-software/lighthouse-check@0.0.6 # ideally later :)

jobs:
  test: 
    executor: lighthouse-check/default
    steps:
      - lighthouse-check/audit:
          urls: https://www.foo.software/lighthouse,https://www.foo.software/contact
          # this serves as an example, however if the below environment variables
          # are set - the below params aren't even necessary. for example - if
          # LIGHTHOUSE_CHECK_AWS_ACCESS_KEY_ID is already set - you don't need
          # the line below.
          awsAccessKeyId: $LIGHTHOUSE_CHECK_AWS_ACCESS_KEY_ID
          awsBucket: $LIGHTHOUSE_CHECK_AWS_BUCKET
          awsRegion: $LIGHTHOUSE_CHECK_AWS_REGION
          awsSecretAccessKey: $LIGHTHOUSE_CHECK_AWS_SECRET_ACCESS_KEY
          slackWebhookUrl: $LIGHTHOUSE_CHECK_SLACK_WEBHOOK_URL

workflows:
  test:
    jobs:
      - test
```

<img alt="lighthouse-check CircleCI post-deploy" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-circle-ci.png" width="600" />

Reports are saved as "artifacts".

<img alt="lighthouse-check CircleCI post-deploy artifacts" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-artifact-circle-ci.png" width="600" />

Upon clicking the HTML file artifacts, we can see the full report!

<img alt="lighthouse-check CircleCI post-deploy artifact Lighthouse report" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-artifact-circle-ci-report.png" width="600" />

In the example above we also uploaded reports to S3. Why would we do this? If we want to persist historical data - we don't want to rely on temporary cloud storage.

## Implementing with GitHub Actions

Similar to the CircleCI implementation, we can also create a workflow implementation with [GitHub Actions](https://github.com/features/actions) using [`lighthouse-check-action`](https://github.com/foo-software/lighthouse-check-action). Example below.

> `.github/workflows/test.yml`

```yaml
name: Test Lighthouse Check
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: mkdir /tmp/artifacts
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        with:
          accessToken: ${{ secrets.LIGHTHOUSE_CHECK_GITHUB_ACCESS_TOKEN }}
          author: ${{ github.actor }}
          awsAccessKeyId: ${{ secrets.LIGHTHOUSE_CHECK_AWS_ACCESS_KEY_ID }}
          awsBucket: ${{ secrets.LIGHTHOUSE_CHECK_AWS_BUCKET }}
          awsRegion: ${{ secrets.LIGHTHOUSE_CHECK_AWS_REGION }}
          awsSecretAccessKey: ${{ secrets.LIGHTHOUSE_CHECK_AWS_SECRET_ACCESS_KEY }}
          branch: ${{ github.ref }}
          outputDirectory: /tmp/artifacts
          urls: 'https://www.foo.software/lighthouse,https://www.foo.software/contact'
          sha: ${{ github.sha }}
          slackWebhookUrl: ${{ secrets.LIGHTHOUSE_CHECK_WEBHOOK_URL }}
      - name: Upload artifacts
        uses: actions/upload-artifact@master
        with:
          name: Lighthouse reports
          path: /tmp/artifacts
```

## Overriding Config and Option Defaults

You can override default config and options by specifying `overridesJsonFile` option. Contents of this overrides JSON file can have two possible fields; `options` and `config`. These two fields are eventually used by Lighthouse to populate `opts` and `config` arguments respectively as illustrated in [Using programmatically](https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#using-programmatically). The two objects populating this JSON file are merged shallowly with the default [config](https://github.com/foo-software/lighthouse-check/blob/master/src/__snapshots__/lighthouseConfig.test.js.snap) and [options](https://github.com/foo-software/lighthouse-check/blob/master/src/__snapshots__/lighthouseOptions.test.js.snap).

> Example content of `overridesJsonFile`

```json
{
  "config": {
    "settings": {
      "onlyCategories": ["performance"]
    }
  },
  "options": {
    "chromeFlags": [
      "--disable-dev-shm-usage"
    ]
  }
}
```

## CLI

Running `lighthouse-check` in the example below will run Lighthouse audits against `https://www.foo.software/lighthouse` and `https://www.foo.software/contact` and output a report in the '/tmp/artifacts' directory.

Format is `--option <argument>`. Example below.

```bash
$ lighthouse-check --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact" \
  --outputDirectory /tmp/artifacts
```

> `lighthouse-check-status` example

```bash
$ lighthouse-check-status --outputDirectory /tmp/artifacts \
  --minAccessibilityScore 90 \
  --minBestPracticesScore 90 \
  --minPerformanceScore 70 \
  --minProgressiveWebAppScore 70 \
  --minSeoScore 80
```

## CLI Options

All options mirror [the NPM module](#options). The only difference is that array options like `urls` are passed in as a comma-separated string as an argument using the CLI.

## Docker

```bash
$ docker pull foosoftware/lighthouse-check:latest
$ docker run foosoftware/lighthouse-check:latest \
  lighthouse-check --verbose \
  --urls "https://www.foo.software/lighthouse,https://www.foo.software/contact"
```

## Options

`lighthouse-check` functions accept a single configuration object.

#### `lighthouseCheck`

You can choose from two ways of running audits - locally in your own environment or remotely via Foo's Automated Lighthouse Check API. You can think of local runs as the default implementation. For directions about how to run remotely see the [Foo's Automated Lighthouse Check API Usage](#foo-api-usage) section. We denote which options are available to a run type with the `Run Type` values of either `local`, `remote`, or `both`.

Below are options for the exported `lighthouseCheck` function or `lighthouse-check` command with CLI.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Run Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>apiToken</code></td>
    <td>The foo.software account API token found in the dashboard.</td>
    <td><code>string</code></td>
    <td><code>remote</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsAccessKeyId</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsBucket</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsRegion</code></td>
    <td>The AWS <code>region</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsSecretAccessKey</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>branch</code></td>
    <td>For Slack notifications: A version control branch, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>configFile</code></td>
    <td>A configuration file path in JSON format which holds all options defined here. This file should be relative to the file being interpretted.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>extraHeaders</code></td>
    <td>HTTP Header key/value pairs to send in requests. If using the CLI this will need to be stringified, for example: <code>"{\"Cookie\":\"monster=blue\", \"x-men\":\"wolverine\"}"</code></td>
    <td><code>object</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop', 'all'])</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>locale</code></td>
    <td>A locale for Lighthouse reports. Example: <code>ja</code></td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>maxWaitForLoad</code></td>
    <td>The maximum amount of time to wait for a page to load in ms.</td>
    <td><code>number</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>overridesJsonFile</code></td>
    <td>A JSON file with config and option fields to overrides defaults. <a href="#overriding-config-and-option-defaults">Read more here</a>.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. You can do this an an alternative or combined with an S3 upload.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>pr</code></td>
    <td>For Slack notifications: A version control pull request URL, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>prCommentAccessToken</code></td>
    <td><a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line">Access token</a> of a user to post PR comments.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>prCommentEnabled</code></td>
    <td>If <code>true</code> and <code>prCommentAccessToken</code> is set along with <code>prCommentUrl</code>, scores will be posted as comments.</td>
    <td><code>boolean</code></td>
    <td><code>both</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>prCommentSaveOld</code></td>
    <td>If <code>true</code> and PR comment options are set, new comments will be posted on every change vs only updating once comment with most recent scores.</td>
    <td><code>boolean</code></td>
    <td><code>both</code></td>
    <td><code>false</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>prCommentUrl</code></td>
    <td>An endpoint to post comments to. Typically this will be from <a href="https://developer.github.com/v3/pulls/reviews/#create-a-pull-request-review">GitHub's API</a>. Example: <code>https://api.github.com/repos/:owner/:repo/pulls/:pull_number/reviews</code></td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>slackWebhookUrl</code></td>
    <td>A Slack Incoming Webhook URL to send notifications to.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>sha</code></td>
    <td>For Slack notifications: A version control <code>sha</code>, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td><code>remote</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G', 'desktopDense4G'])</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>timeout</code></td>
    <td>Minutes to timeout. If <code>wait</code> is <code>true</code> (it is by default), we wait for results. If this timeout is reached before results are received an error is thrown.</td>
    <td><code>number</code></td>
    <td><code>local</code></td>
    <td><code>10</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>An array of URLs (or page API tokens if running remotely). In the CLI this value should be a comma-separated list.</td>
    <td><code>array</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
    <td>yes</td>
  </tr>
  <tr>
    <td><code>verbose</code></td>
    <td>If <code>true</code>, print out steps and results to the console.</td>
    <td><code>boolean</code></td>
    <td><code>both</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>wait</code></td>
    <td>If <code>true</code>, waits for all audit results to be returned, otherwise URLs are only enqueued.</td>
    <td><code>boolean</code></td>
    <td><code>remote</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
</table>

#### `validateStatus`

`results` parameter is required or alternatively `outputDirectory`. To utilize `outputDirectory` - the same value would also need to be specified when calling `lighthouseCheck`.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>minAccessibilityScore</code></td>
    <td>The minimum accessibility Lighthouse score required.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>minBestPracticesScore</code></td>
    <td>The minimum best practices Lighthouse score required.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>minPerformanceScore</code></td>
    <td>The minimum performance Lighthouse score required.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>minProgressiveWebAppScore</code></td>
    <td>The minimum progressive web app Lighthouse score required.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>minSeoScore</code></td>
    <td>The minimum SEO Lighthouse score required.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. When the results object isn't specified, this value will need to be.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>results</code></td>
    <td>A results object representing results of Lighthouse audits.</td>
    <td><code>number</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
</table>

## Return Payload

`lighthouseCheck` function returns a promise which either resolves as an object or rejects as an error object. In both cases the payload will be of the same shape documented below.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
  </tr>
  <tr>
    <td><code>code</code></td>
    <td>A code to signify failure or succes.</td>
    <td><code>oneOf(["SUCCESS", "ERROR_GENERIC", ...])</code> see <a href="src/errorCodes.js">errorCodes.js</a> for all error codes.</td>
  </tr>
  <tr>
    <td><code>data</code></td>
    <td>An array of results returned by the API.</td>
    <td><code>array</code></td>
  </tr>
  <tr>
    <td><code>message</code></td>
    <td>A message to elaborate on the code. This field isn't always populated.</td>
    <td><code>string</code></td>
  </tr>
</table>

## Credits

> <img src="https://lighthouse-check.s3.amazonaws.com/images/logo-simple-blue-light-512.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software/lighthouse). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
