# Lighthouse Check Action

<img alt="Lighthouse" src="https://lighthouse-check.s3.amazonaws.com/images/lighthouse-600x600.png" width="10%" align="left" />
<p>A GitHub Action for running Lighthouse audits automatically workflows. Lighthouse Check Action provides simple configuration and a long list of features for advanced customization including <strong>Slack</strong> notifications, <strong>AWS S3</strong> HTML report uploads, and more!</p>

Check out [the docs](https://www.foo.software/docs/lighthouse-check-github-action) to get started with advanced configurations or refer to the [quick start section](#quick-start) below.

## How this Project Differs from Others

This project differes with its ease of use for simple cases and numerous features for advanced needs.

- ✔ Lighthouse audit **multiple** URLs or just one.
- 👌 PR comments of audit scores.
- 🎉 Save HTML reports locally.
- 💖 Upload HTML reports as artifacts.
- 🙌 Upload HTML reports to AWS S3.
- 🔥 Fail a workflow when minimum scores aren't met.
- 🛎️ Slack notifications **with Git info** (author, branch, PR, etc).
- 💎 Easily save a record of all your audits via Foo's free service.
- 🤗 [Detailed documentation](https://www.foo.software/docs/lighthouse-check-github-action)!

## Quick Start

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

## Inputs and Advanced Configuration

For detailed documentation of all inputs and advanced configuration - visit [the documentation](https://www.foo.software/docs/lighthouse-check-github-action)!

## Credits

> <img src="https://lighthouse-check.s3.amazonaws.com/images/logo-simple-blue-light-512.png" width="100" height="100" align="left" /> This package was brought to you by [Foo - a website quality monitoring tool](https://www.foo.software). Automatically test and monitor website performance, SEO and accessibility with Lighthouse. Analyze historical records of Lighthouse tests with automated monitoring. Report with confidence about SEO and performance improvements to stay on top of changes when they happen!
