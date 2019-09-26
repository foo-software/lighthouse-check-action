# Lighthouse Check Action

A GitHub Action for running multiple Lighthouse audits automatically in a workflow with a rich set of bonus features.

## Inputs

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Type</th>
    <th>Default</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>author</code></td>
    <td>For Slack notifications: A user handle, typically from GitHub.</td>
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
    <td><code>emulatedFormFactor</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobile', 'desktop']</code></td>
    <td><code>mobile</code></td>
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
  <tr>
    <td><code>throttlingMethod</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['simulate', 'devtools', 'provided'])</code></td>
    <td><code>simulate</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>throttling</code></td>
    <td>Lighthouse setting only used for local audits. See <a href="https://github.com/foo-software/lighthouse-check/tree/master/src/lighthouseConfig.js"><code>lighthouse-check</code></a> comments for details.</td>
    <td><code>oneOf(['mobileSlow4G', 'mobileRegluar3G'])</code></td>
    <td><code>mobileSlow4G</code></td>
    <td>no</td>
  </tr>
  <tr>
    <td><code>urls</code></td>
    <td>A comma-separated list of URLs to be audited.</td>
    <td><code>string</code></td>
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
</table>

## Outputs

### `lighthouse-check-results`

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

## Example usage

In the below example we run Lighthouse on two URLs which logs scores, saves the HTML reports as artifacts, uploads them to AWS S3, and notifies via Slack with details about the change in Git.

```yaml
name: Test Lighthouse Check
on: [push]

jobs:
  lighthouse-check:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - uses: actions/bin/debug@master
    - run: npm install
    - run: mkdir /tmp/artifacts
    - name: Run Lighthouse
      uses: ./
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
