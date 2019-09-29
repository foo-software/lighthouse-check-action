[![CircleCI](https://circleci.com/gh/foo-software/lighthouse-check.svg?style=svg)](https://circleci.com/gh/foo-software/lighthouse-check)

# `@foo-software/lighthouse-check`

> An NPM module and CLI to run Lighthouse audits programmatically. This project aims to add bells and whistles to automated Lighthouse testing for DevOps workflows. Easily implement in your Continuous Integration or Continuous Delivery pipeline.

<img src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-audit-report.png" />

# Features

- [Simple usage](#basic-usage) - only one parameter required.
- Run **multiple** Lighthouse audits with one command. 
- Optionally [save an HTML report locally](#saving-reports-locally).
- Optionally [save an HTML report in an AWS S3 bucket](#saving-reports-to-s3).
- [Easy setup with Slack Webhooks](#implementing-with-slack). Just add your Webhook URL and `lighthouse-check` will send results and optionally include versioning data like branch, author, PR, etc (typically from GitHub).
- NPM module for programmatic [usage](#basic-usage).
- CLI - see [CLI Usage](#cli-usage).
- Docker - see [Docker Usage](#docker-usage).
- Support for implementations like [CircleCI](#implementing-with-circleci).

# Install

```bash
npm install @foo-software/lighthouse-check
```

# Usage

`@foo-software/lighthouse-check` provides several functionalities beyond standard Lighthouse audits. It's recommended to start with a basic implementation and expand on it as needed.

## Basic Usage

Calling `lighthouseCheck` will run Lighthouse audits against `https://www.foo.software` and `https://www.foo.software/contact`.

```javascript
import { lighthouseCheck } from '@foo-software/lighthouse-check';

(async () => {
  const response = await lighthouseCheck({
    urls: [
      'https://www.foo.software',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact"
```

The CLI will log the results.

<img alt="lighthouse-check CLI output" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-cli-output.jpg" width="600" />

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
      'https://www.foo.software',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact" \
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
      'https://www.foo.software',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact" \
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
      'https://www.foo.software',
      'https://www.foo.software/contact'
    ]
  });

  console.log('response', response);
})();
```

Or via CLI.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact" \
  --slackWebhookUrl "https://www.my-slack-webhook-url.com"
```

The below screenshot shows an advanced implementation as detailed in the [CircleCI example](#implementing-with-circleci).

<img alt="lighthouse-check Slack Notification" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-slack.png" width="600" />

## Enforcing Minimum Scores

You can use `validateStatus` to enforce minimum scores. This would be handy in a DevOps workflow for example.

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
        'https://www.foo.software',
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
    // https://www.foo.software: Performance: minimum score: 70, actual score: 64
    // https://www.foo.software/contact: Performance: minimum score: 70, actual score: 44
  }
})();
```

Or via CLI. **Important**: `outputDirectory` value must be defined and the same in both commands.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact" \
  --outputDirectory /tmp/artifacts \
$ lighthouse-check-status --outputDirectory /tmp/artifacts \
  --minAccessibilityScore 90 \
  --minBestPracticesScore 90 \
  --minPerformanceScore 70 \
  --minProgressiveWebAppScore 70 \
  --minSeoScore 80
```

## Implementing with CircleCI

In the below example we run Lighthouse audits on two URLs, save reports as artifacts, deploy reports to S3 and send a Slack notification with GitHub info. We defined environment variables like `AWS_BUCKET` in the [CircleCI project settings](https://circleci.com/docs/2.0/settings/#project-settings-page).

```yaml
version: 2
jobs:
  # build, test, deploy, etc
  # ...
  post-deploy:
    docker:
      - image: foosoftware/lighthouse-check:latest
    steps:
      - checkout
      - run:
          name: Run Lighthouse Audits and Save Results
          command: |
            mkdir /tmp/artifacts
            lighthouse-check --verbose \
              --author $CIRCLE_USERNAME \
              --awsAccessKeyId $AWS_ACCESS_KEY_ID \
              --awsBucket $AWS_BUCKET \
              --awsRegion $AWS_REGION \
              --awsSecretAccessKey $AWS_SECRET_ACCESS_KEY \
              --branch $CIRCLE_BRANCH \
              --configFile ./lighthouse-check.json \
              --outputDirectory /tmp/artifacts \
              --pr $CIRCLE_PULL_REQUEST \
              --sha $CIRCLE_SHA1 \
              --slackWebhookUrl $SLACK_WEBHOOK_URL \
      - store_artifacts:
          name: Store Artifacts
          path: /tmp/artifacts

workflows:
  version: 2
  test-deploy-post-deploy:
    jobs:
      # build, test, deploy, etc
      # ...
      - post-deploy:
          requires:
            - deploy
```

<img alt="lighthouse-check CircleCI post-deploy" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-circle-ci.png" width="600" />

Reports are saved as "artifacts".

<img alt="lighthouse-check CircleCI post-deploy artifacts" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-artifact-circle-ci.png" width="600" />

Upon clicking the HTML file artifacts, we can see the full report!

<img alt="lighthouse-check CircleCI post-deploy artifact Lighthouse report" src="https://s3.amazonaws.com/foo.software/images/marketing/screenshots/lighthouse-check-artifact-circle-ci-report.png" width="600" />

In the example above we also uploaded reports to S3. Why would we do this? If we want to persist historical data - we don't want to rely on temporary cloud storage.

## Options

`lighthouse-check` functions accept a single configuration object.

#### `lighthouseCheck`

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <!--
    <tr>
      <td><code>apiToken</code></td>
      <td>The lighthouse-check account API token found in the dashboard.</td>
      <td><code>string</code></td>
      <td><code>undefined</code></td>
      <td>no</td>
    </tr>
  -->
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsAccessKeyId</code></td>
    <td>The AWS <code>accessKeyId</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsBucket</code></td>
    <td>The AWS <code>Bucket</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsRegion</code></td>
    <td>The AWS <code>region</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>awsSecretAccessKey</code></td>
    <td>The AWS <code>secretAccessKey</code> for an S3 bucket.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>branch</code></td>
    <td>For Slack notifications: A version control branch, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>configFile</code></td>
    <td>A configuration file path in JSON format which holds all options defined here. This file should be relative to the file being interpretted.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
  </tr>
  <tr>
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop']</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>locale</code></td>
    <td>A locale for Lighthouse reports. Example: <code>ja</code></td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>outputDirectory</code></td>
    <td>An absolute directory path to output report. You can do this an an alternative or combined with an S3 upload.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>pr</code></td>
    <td>For Slack notifications: A version control pull request URL, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>slackWebhookUrl</code></td>
    <td>A Slack Incoming Webhook URL to send notifications to.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>sha</code></td>
    <td>For Slack notifications: A version control <code>sha</code>, typically from GitHub.</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <!--
  <tr>
    <td><code>tag</code></td>
    <td>An optional tag or name (example: <code>build #2</code> or <code>v0.0.2</code>).</td>
    <td><code>string</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  -->
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="src/lighthouseConfig.js">src/lighthouseConfig.js</a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G'])</code></td>
    <td><code>undefined</code></td>
    <td>no</td>
  </tr>
  <!--
  <tr>
    <td><code>timeout</code></td>
    <td>Minutes to timeout. If <code>wait</code> is <code>true</code> (it is by default), we wait for results. If this timeout is reached before results are received an error is thrown.</td>
    <td><code>number</code></td>
    <td><code>10</code></td>
    <td>no</td>
  </tr>
  -->
  <tr>
    <td><code>urls</code></td>
    <td>An array of URLs. NOTE: in the CLI this value should be a comma-separated list.</td>
    <td><code>array</code></td>
    <td><code>undefined</code></td>
    <td>yes</td>
  </tr>
  <tr>
    <td><code>verbose</code></td>
    <td>If <code>true</code>, print out steps and results to the console.</td>
    <td><code>boolean</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  <!--
  <tr>
    <td><code>wait</code></td>
    <td>If <code>true</code>, waits for all audit results to be returned, otherwise URLs are only enqueued.</td>
    <td><code>boolean</code></td>
    <td><code>true</code></td>
    <td>no</td>
  </tr>
  -->
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

## CLI Usage

Running `lighthouse-check` in the example below will run Lighthouse audits against `https://www.foo.software` and `https://www.foo.software/contact` and output a report in the '/tmp/artifacts' directory.

Format is `--option <argument>`. Example below.

```bash
$ lighthouse-check --urls "https://www.foo.software,https://www.foo.software/contact" \
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

## Docker Usage

```bash
$ docker pull foosoftware/lighthouse-check:latest
$ docker run foosoftware/lighthouse-check:latest \
  lighthouse-check --verbose \
  --urls "https://www.foo.software,https://www.foo.software/contact"
```

## Credits

> <img src="https://s3.amazonaws.com/foo.software/images/logo-200x200.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website performance monitoring tool](https://www.foo.software). Create a **free account** with standard performance testing. Automatic website performance testing, uptime checks, charts showing performance metrics by day, month, and year. Foo also provides real time notifications when performance and uptime notifications when changes are detected. Users can integrate email, Slack and PagerDuty notifications.
