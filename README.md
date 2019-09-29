# Lighthouse Check Action

A GitHub Action for running Lighthouse audits automatically in a workflow with a rich set of extra features. Simple implementation or advanced customization including **Slack** notifications, **AWS S3** HTML report uploads, and more!

<table>
  <tr>
    <td>
      <img alt="Lighthouse" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/lighthouse-logo.png" />
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
- 💗 Save HTML reports locally.
- 💚 Upload HTML reports as artifacts.
- 💙 Upload HTML reports to AWS S3.
- ❤️ Fail a workflow when minimum scores aren't met. [Example at the bottom](#user-content-example-usage-failing-workflows-by-enforcing-minimum-scores).
- 💜 **Slack** notifications.
- 💖 Slack notifications **with Git info** (author, branch, PR, etc).

## Screenshot: Output
<img alt="Lighthouse Check GitHub action output" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-output.png" />

## Screenshot: Save HTML Reports as Artifacts
<img alt="Lighthouse Check GitHub action save artifacts" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-artifacts.png" width="600" />

## Screenshot: HTML Reports
<img alt="Lighthouse Check GitHub action HTML report" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-lighthouse-report.png" />

## Screenshot: Slack Notifications
<img alt="Lighthouse Check GitHub action Slack notification" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-slack.png" width="600" />

## Screenshot: Fail Workflow when Minimum Scores Aren't Met

<img alt="Lighthouse Check GitHub action fail if scores don't meet minimum requirement on a PR" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action-pr-fail.png" />

<img alt="Lighthouse Check GitHub action fail if scores don't meet minimum requirement" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action.png" />

## Inputs

All fields are optional with the exception of either `urls` or `configFile`.

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
  </tr>
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsAccessKeyId</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsBucket</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsRegion</code></td>
    <td>The AWS <code>region</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>awsSecretAccessKey</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>branch</code></td>
    <td>For Slack notifications: A version control branch, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>configFile</code></td>
    <td>A configuration file path in JSON format which holds all options defined here. This file should be relative to the file being interpretted. In this case it will most likely be the root of the repo ("./")</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop']</code></td>
    <td><code>mobile</code></td>
  </tr>
  <tr>
    <td><code>locale</code></td>
    <td>A locale for Lighthouse reports. Example: <code>ja</code></td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. You can do this an an alternative or combined with an S3 upload.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>pr</code></td>
    <td>For Slack notifications: A version control pull request URL, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>sha</code></td>
    <td>For Slack notifications: A version control <code>sha</code>, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>slackWebhookUrl</code></td>
    <td>A Slack Incoming Webhook URL to send notifications to.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>simulate</code></td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G'])</code></td>
    <td><code>mobileSlow4G</code></td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>A comma-separated list of URLs to be audited.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>verbose</code></td>
    <td>If <code>true</code>, print out steps and results to the console.</td>
    <td><code>boolean</code></td>
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

## Example Usage

In the below example we run Lighthouse on two URLs, log scores, save the HTML reports as artifacts, upload reports to AWS S3, notify via Slack with details about the change from Git data.

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

## Example Usage: Failing Workflows by Enforcing Minimum Scores

We can expand on the example above by optionally failing a workflow if minimum scores aren't met. We do this using

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
        uses: foo-software/lighthouse-check-status-action
        with:
          lighthouseCheckResults: ${{ steps.lighthouseCheck.outputs.lighthouseCheckResults }}
          minAccessibilityScore: 90
          minBestPracticesScore: 50
          minPerformanceScore: 50
          minProgressiveWebAppScore: 50
          minSeoScore: 50
```

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications. Users can integrate email, Slack and PagerDuty notifications.
