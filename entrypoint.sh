#!/bin/sh -l

echo "11...$11"

lighthouse-check \
  --author $1 \
  --apiToken $2 \
  --awsAccessKeyId $3 \
  --awsBucket $4 \
  --awsRegion $5\
  --awsSecretAccessKey $6 \
  --branch $7 \
  --configFile $8 \
  --emulatedFormFactor $9 \
  --locale $10 \
  --help $11 \
  --outputDirectory /tmp/artifacts \
  --pr $12 \
  --sha $13 \
  --slackWebhookUrl $14 \
  --tag $15 \
  --timeout $16 \
  --throttling $17 \
  --throttlingMethod $18 \
  --urls $19 \
  --verbose $20 \
  --wait $21 \
