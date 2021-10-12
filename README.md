# Lighthouse Check Action

<img alt="Lighthouse" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-600x600.png" width="10%" align="left" />
<p>A GitHub Action for running Lighthouse audits automatically workflows. Lighthouse Check Action provides simple configuration and a long list of features for advanced customization including <strong>Slack</strong> notifications, <strong>AWS S3</strong> HTML report uploads, and more! Check out <a href="https://www.foo.software/docs/lighthouse-check-github-action">the docs</a> to get started with advanced configurations or refer to the <a href="#quick-start">quick start section below</a>.</p>

## How this Project Differs from Others

This project differes from others with its ease of use for simple cases and numerous features for advanced needs.

- ✨ Lighthouse audit **multiple** URLs or just one.
- 💬 PR comments of audit scores.
- 🎉 Save HTML reports locally.
- 💖 Upload HTML reports as artifacts.
- 🙌 Upload HTML reports to AWS S3.
- 🔥 Fail a workflow when minimum scores aren't met.
- 🛎️ Slack notifications **with Git info** (author, branch, PR, etc).
- 💎 Easily save a record of all your audits via Foo's free service.
- 🤗 [Detailed documentation](https://www.foo.software/docs/lighthouse-check-github-action)!

# Quick Start

```yaml
name: Lighthouse
on: [pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Lighthouse
      uses: foo-software/lighthouse-check-action@master
      with:
        urls: 'https://www.foo.software,https://www.google.com'
```

# Inputs and Advanced Configuration

For detailed documentation of all inputs and advanced configuration - visit [the documentation](https://www.foo.software/docs/lighthouse-check-github-action)!

# Screenshots

<table>
  <tr>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-output.png">
          <img alt="Lighthouse Check GitHub action output" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-output.png" />
        </a>
        <figcaption>
          Output
        </figcaption>
      </figure>
    </td>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-artifacts.png">
          <img alt="Lighthouse Check GitHub action save artifacts" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-artifacts.png" />
        </a>
        <figcaption>
          Save HTML Reports as Artifacts
        </figcaption>
      </figure>
    </td>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-lighthouse-report.png">
          <img alt="Lighthouse Check GitHub action HTML report" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-lighthouse-report.png" />
        </a>
        <figcaption>
          HTML Reports
        </figcaption>
      </figure>
    </td>
  </tr>
  <tr>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-check-pr-comment.png">
          <img alt="Lighthouse Check PR comments" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-check-pr-comment.png">
        </a>
        <figcaption>
          PR Comments
        </figcaption>
      </figure>
    </td>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-slack.png">
          <img alt="Lighthouse Check GitHub action Slack notification" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-slack.png" />
        </a>
        <figcaption>
          Slack Notifications
        </figcaption>
      </figure>
    </td>
    <td align="center" width="33.3333333333333%">
      <figure>
        <a href="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action-pr-fail.png">
          <img alt="Lighthouse Check GitHub action fail if scores don't meet minimum requirement on a PR" src="https://lighthouse-check.s3.amazonaws.com/images/github-actions/github-action-lighthouse-check-status-action-pr-fail.png" />
        </a>
        <figcaption>
          Fail Workflow when Minimum Scores Aren't Met
        </figcaption>
      </figure>
    </td>
  </tr>
</table>

## Credits

> <img src="https://lighthouse-check.s3.amazonaws.com/images/logo-simple-blue-light-512.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website quality monitoring tool](https://www.foo.software). Automatically test and monitor website performance, SEO and accessibility with Lighthouse. Analyze historical records of Lighthouse tests with automated monitoring. Report with confidence about SEO and performance improvements to stay on top of changes when they happen!
