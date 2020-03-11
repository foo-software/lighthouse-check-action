# Lighthouse Check Action

> A GitHub Action for running Lighthouse audits automatically in a workflow with a rich set of extra features. Simple implementation or advanced customization including **Slack** notifications, **AWS S3** HTML report uploads, and more!

This project provides **two ways of running audits** - "locally" by default in a dockerized GitHub environment or remotely via [Automated Lighthouse Check](https://www.automated-lighthouse-check.com) API. For basic usage, running locally will suffice, but if you'd like to maintain a historical record of Lighthouse audits and utilize other features, you can follow the [steps and examples](#usage-automated-lighthouse-check-api).

<table>
  <tr>
    <td>
      <img alt="Lighthouse" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-600x600.png" width="400" />
    </td>
    <td>
      <img alt="AWS S3" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/aws-s3-logo.png" />
    </td>
    <td>
      <img alt="Slack" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/slack-logo.png" />
    </td>
  </tr>
</table>

## How this Project Differs from Others

Simple configuration or choose from a variety of features below. See the [example Lighthouse Check action implementation](#example-usage).

- 💛 Lighthouse audit **multiple** URLs or just one.
- 💛 Save a record of all your audits via [Automated Lighthouse Check](#usage-automated-lighthouse-check-api).
- 💗 PR comments of audit scores.
- 💗 Save HTML reports locally.
- 💚 Upload HTML reports as artifacts.
- 💙 Upload HTML reports to AWS S3.
- ❤️ Fail a workflow when minimum scores aren't met. [Example at the bottom](#user-content-example-usage-failing-workflows-by-enforcing-minimum-scores).
- 💜 **Slack** notifications.
- 💖 Slack notifications **with Git info** (author, branch, PR, etc).

# Table of Contents

- [Screenshots](#screenshots)
  - [Output](#screenshot-output)
  - [Save HTML Reports as Artifacts](#screenshot-save-html-reports-as-artifacts)
  - [HTML Reports](#screenshot-html-reports)
  - [PR Comments](#screenshot-pr-comments)
  - [Slack Notifications](#screenshot-slack-notifications)
  - [Fail Workflow when Minimum Scores Aren't Met](#screenshot-fail-workflow-when-minimum-scores-arent-met)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage](#usage)
  - [Standard Example](#usage-standard-example)
  - [Failing Workflows by Enforcing Minimum Scores](#usage-failing-workflows-by-enforcing-minimum-scores)
  - [Automated Lighthouse Check API](#usage-automated-lighthouse-check-api)
  - [Example with ZEIT Now](#usage-zeit-now)

# Screenshots

Screenshots below for visual look at the things you can do.

## Screenshot: Output
<img alt="Lighthouse Check GitHub action output" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-output.png" />

## Screenshot: Save HTML Reports as Artifacts
<img alt="Lighthouse Check GitHub action save artifacts" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-artifacts.png" width="600" />

## Screenshot: HTML Reports
<img alt="Lighthouse Check GitHub action HTML report" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-lighthouse-report.png" />

## Screenshot: PR Comments
<img alt="Lighthouse Check PR comments" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-check-pr-comment.png" width="400">

## Screenshot: Slack Notifications
<img alt="Lighthouse Check GitHub action Slack notification" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-slack.png" width="520" />

## Screenshot: Fail Workflow when Minimum Scores Aren't Met

<img alt="Lighthouse Check GitHub action fail if scores don't meet minimum requirement on a PR" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action-pr-fail.png" width="600" />

<img alt="Lighthouse Check GitHub action fail if scores don't meet minimum requirement" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action.png" />

## Inputs

You can choose from two ways of running audits - "locally" in a dockerized GitHub environment (by default) or remotely via the [Automated Lighthouse Check](https://www.automated-lighthouse-check.com) API. For directions about how to run remotely see the [Automated Lighthouse Check API Usage](#usage-automated-lighthouse-check-api) section. We denote which options are available to a run type with the `Run Type` values of either `local`, `remote`, or `both` respectively.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Run Type</th>
    <th>Default</th>
  </tr>
  <tr>
    <td><code>accessToken</code></td>
    <td><a href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line">Access token</a> of a user (to do things like post PR comments for example).</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>apiToken</code></td>
    <td>The automated-lighthouse-check.com account API token found in the dashboard.</td>
    <td><code>string</code></td>
    <td><code>remote</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsAccessKeyId</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsBucket</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsRegion</code></td>
    <td>The AWS <code>region</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsSecretAccessKey</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>branch</code></td>
    <td>For Slack notifications: A version control branch, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>configFile</code></td>
    <td>A configuration file path in JSON format which holds all options defined here. This file should be relative to the file being interpretted. In this case it will most likely be the root of the repo ("./")</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop']</code></td>
    <td><code>local</code></td>
    <td><code>mobile</code></td>
  </tr>
  <tr>
    <td><code>locale</code></td>
    <td>A locale for Lighthouse reports. Example: <code>ja</code></td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. You can do this an an alternative or combined with an S3 upload.</td>
    <td><code>string</code></td>
    <td><code>local</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>sha</code></td>
    <td>For Slack notifications: A version control <code>sha</code>, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>slackWebhookUrl</code></td>
    <td>A Slack Incoming Webhook URL to send notifications to.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td><code>remote</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>local</code></td>
    <td><code>simulate</code></td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G'])</code></td>
    <td><code>local</code></td>
    <td><code>mobileSlow4G</code></td>
  </tr>
  <tr>
    <td><code>timeout</code></td>
    <td>Minutes to timeout. If <code>wait</code> is <code>true</code> (it is by default), we wait for results. If this timeout is reached before results are received an error is thrown.</td>
    <td><code>number</code></td>
    <td><code>local</code></td>
    <td><code>10</code></td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>A comma-separated list of URLs to be audited.</td>
    <td><code>string</code></td>
    <td><code>both</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>verbose</code></td>
    <td>If <code>true</code>, print out steps and results to the console.</td>
    <td><code>boolean</code></td>
    <td><code>both</code></td>
    <td><code>true</code></td>
  </tr>
  <tr>
    <td><code>wait</code></td>
    <td>If <code>true</code>, waits for all audit results to be returned, otherwise URLs are only enqueued.</td>
    <td><code>boolean</code></td>
    <td><code>remote</code></td>
    <td><code>true</code></td>
  </tr>
</table>

## Outputs

### `lighthouseCheckResults`

An object of the below shape.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
  </tr>
  <tr>
    <td><code>code</code></td>
    <td>A code set by <code>lighthouse-check</code> to represent success or failure. Success will be <code>SUCCESS</code> while errors will look something line <code>ERROR_${reason}</code></td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td><code>data</code></td>
    <td>An array of results with the payload illustrated below.</td>
    <td><code>array</code></td>
  </tr>
</table>

#### `data`

An array of objects with the below shape. Only applicable data will be populated (based on inputs).

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
  </tr>
  <tr>
    <td><code>url</code></td>
    <td>The corresponding URL of the Lighthouse audit.</td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td><code>report</code></td>
    <td>An AWS S3 URL of the report if S3 inputs were specified and upload succeeded.</td>
    <td><code>string</code></td>
  </tr>
  <tr>
    <td><code>scores</code></td>
    <td>An object of Lighthouse scores. See details below.</td>
    <td><code>object</code></td>
  </tr>
</table>

#### `scores`

An object of scores. Each value is a `number`. Names should be self-explanatory - representing the score of each Lighthouse audit type.

<table>
  <tr>
    <th>Name</th>
  </tr>
  <tr>
    <td><code>accessibility</code></td>
  </tr>
  <tr>
    <td><code>bestPractices</code></td>
  </tr>
  <tr>
    <td><code>performance</code></td>
  </tr>
  <tr>
    <td><code>progressiveWebApp</code></td>
  </tr>
  <tr>
    <td><code>seo</code></td>
  </tr>
</table>

## Usage

Below are example combinations of ways to use this GitHub Action.

## Usage: Standard Example

In the below example we run Lighthouse on two URLs, log scores, save the HTML reports as artifacts, upload reports to AWS S3, notify via Slack with details about the change from Git data. By specifying the `pull_request` trigger and `accessToken` - we allow automatic comments of audits on the corresponding PR from the token user.

```yaml
name: Test Lighthouse Check
on: [pull_request]

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
          urls: 'https://www.foo.software,https://www.foo.software/contact'
          sha: ${{ github.sha }}
          slackWebhookUrl: ${{ secrets.LIGHTHOUSE_CHECK_WEBHOOK_URL }}
      - name: Upload artifacts
        uses: actions/upload-artifact@master
        with:
          name: Lighthouse reports
          path: /tmp/artifacts
```

## Usage: Failing Workflows by Enforcing Minimum Scores

We can expand on the example above by optionally failing a workflow if minimum scores aren't met. We do this using [`foo-software/lighthouse-check-status-action`](https://github.com/foo-software/lighthouse-check-status-action).

```yaml
name: Test Lighthouse Check with Minimum Score Enforcement
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: npm install
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        id: lighthouseCheck
        with:
          urls: 'https://www.foo.software,https://www.foo.software/contact'
          # ... all your other inputs
      - name: Handle Lighthouse Check results
        uses: foo-software/lighthouse-check-status-action@master
        with:
          lighthouseCheckResults: ${{ steps.lighthouseCheck.outputs.lighthouseCheckResults }}
          minAccessibilityScore: "90"
          minBestPracticesScore: "50"
          minPerformanceScore: "50"
          minProgressiveWebAppScore: "50"
          minSeoScore: "50"
```

## Usage: Automated Lighthouse Check API

[Automated Lighthouse Check](https://www.automated-lighthouse-check.com) can monitor your website's quality by running audits automatically! It can provide a historical record of audits over time to track progression and degradation of website quality. [Create a free account](https://www.automated-lighthouse-check.com/register) to get started. With this, not only will you have automatic audits, but also any that you trigger additionally. Below are steps to trigger audits on URLs that you've created in your account.

#### Trigger Audits on All Pages in an Account

- Navigate to [your account details](https://www.automated-lighthouse-check.com/account), click into "Account Management" and make note of the "API Token".
- Use the account token as the [`apiToken` input](#inputs).

> Basic example

```yaml
name: Lighthouse Check
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: npm install
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        id: lighthouseCheck
        with:
          apiToken: 'myaccountapitoken'
          # ... all your other inputs
```

#### Trigger Audits on Only Certain Pages in an Account

- Navigate to [your account details](https://www.automated-lighthouse-check.com/account), click into "Account Management" and make note of the "API Token".
- Navigate to [your dashboard](https://www.automated-lighthouse-check.com/dashboard) and once you've created URLs to monitor, click on the "More" link of the URL you'd like to use. From the URL details screen, click the "Edit" link at the top of the page. You should see an "API Token" on this page. It represents the token for this specific page (not to be confused with an **account** API token).
- Use the account token as the [`apiToken` input](#inputs) and page token (or group of page tokens) as [`urls` input](#inputs).

> Basic example

```yaml
name: Lighthouse Check
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: npm install
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        id: lighthouseCheck
        with:
          apiToken: 'myaccountapitoken'
          urls: 'mypagetoken1,mypagetoken2'
          # ... all your other inputs
```

You can combine usage with other options for a more advanced setup. Example below.

> Runs audits remotely and posts results as comments in a PR

```yaml
name: Lighthouse Check
on: [pull_request]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - run: npm install
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        id: lighthouseCheck
        with:
          accessToken: ${{ secrets.LIGHTHOUSE_CHECK_GITHUB_ACCESS_TOKEN }}
          apiToken: 'myaccountapitoken'
          urls: 'mypagetoken1,mypagetoken2'
          # ... all your other inputs
```

## Usage: ZEIT Now

> Runs audits on a ZEIT Now ephemeral instance, posts results as comments in a PR and [saves results on Automated Lighthouse Check](https://www.automated-lighthouse-check.com). The example would trigger on pushes to `master` and pull request changes when `master` is the base.

```yaml
name: Lighthouse
on:
  push:
    branches:
      - master
  pull_request:
    branches:
      - master

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - uses: amondnet/now-deployment@master
        id: now
        with:
          zeit-token: ${{ secrets.ZEIT_NOW_TOKEN }}
          now-org-id: ${{ secrets.ZEIT_NOW_ORG_ID }}
          now-project-id: ${{ secrets.ZEIT_NOW_PROJECT_ID }}
      - name: Run Lighthouse
        uses: foo-software/lighthouse-check-action@master
        with:
          accessToken: ${{ secrets.LIGHTHOUSE_CHECK_GITHUB_ACCESS_TOKEN }}
          apiToken: ${{ secrets.LIGHTHOUSE_CHECK_API_TOKEN }}
          tag: GitHub Action
          urls: ${{ secrets.LIGHTHOUSE_CHECK_URL_TOKEN }}::${{ steps.now.outputs.preview-url }}
```

## Credits

> <img src="https://lighthouse-check.s3.amazonaws.com/images/logo-simple-blue-light-512.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications. Users can integrate email, Slack and PagerDuty notifications.
