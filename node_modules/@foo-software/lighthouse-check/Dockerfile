# cmon alpine https://github.com/GoogleChrome/lighthouse/issues/7246
FROM node:10.16.3-alpine

RUN apk update
RUN apk add chromium

# Grrrrr... https://support.circleci.com/hc/en-us/articles/360016505753-Resolve-Certificate-Signed-By-Unknown-Authority-error-in-Alpine-images?flash_digest=39b76521a337cecacac0cc10cb28f3747bb5fc6a
RUN apk add ca-certificates

RUN npm install @foo-software/lighthouse-check -g

CMD ["lighthouse-check"]
