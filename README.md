# Lighthouse Check Action

This action runs Lighthouse audits on specified URLs.

## Inputs

### `urls`

**Required** A comma-separated list of URLs to run Lighthouse against.

## Example usage

```yaml
uses: foo-software/lighthouse-check-action@master
with:
  urls: 'https://www.foo.software,https://www.foo.software/contact'
```
