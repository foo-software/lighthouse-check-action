# Usage

Publish a tag that matches latest major package version. Make sure to update this line of the Dockerfile: `RUN npm install @foo-software/lighthouse-check@8 -g`. We also publish a "latest" tag.

- `./scripts/docker-publish.sh -v 9`
- `./scripts/docker-publish.sh -v latest`
