const core = require('@actions/core');
const { lighthouseCheck } = require('@foo-software/lighthouse-check');

const normalizeInput = input => {
  if (input === 'true') {
    return true;
  }

  if (input === 'false') {
    return false;
  }

  if (input === '') {
    return undefined;
  }

  return input;
};

const getScoreFailMessage = ({
  name,
  url,
  minScore,
  score
}) => {
  // if inputs are not specified - assume we shouldn't fail
  if (!minScore || !score) {
    return [];
  }

  console.log(`${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`);
  if (Number(score) < Number(minScore)) {
    return [`${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`];
  }

  return [];
};

const getFailureMessages = ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  results
}) => {
  console.log('results.data', results.data);
  return results.data.reduce((accumulator, current) => ([
    ...accumulator,
    ...(getScoreFailMessage({
      name: 'Accessibility',
      minScore: minAccessibilityScore,
      score: current.scores.accessibility,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Best Practices',
      minScore: minBestPracticesScore,
      score: current.scores.bestPractices,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Performance',
      minScore: minPerformanceScore,
      score: current.scores.performance,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'Progressive Web App',
      minScore: minProgressiveWebAppScore,
      score: current.scores.progressiveWebApp,
      ...current
    })),
    ...(getScoreFailMessage({
      name: 'SEO',
      minScore: minSeoScore,
      score: current.scores.seo,
      ...current
    }))
  ]), []);
}

(async () => {
  try {
    const urls = normalizeInput(core.getInput('urls'));

    const minAccessibilityScore = normalizeInput(core.getInput('minAccessibilityScore'));
    const minBestPracticesScore = normalizeInput(core.getInput('minBestPracticesScore'));
    const minPerformanceScore = normalizeInput(core.getInput('minPerformanceScore'));
    const minProgressiveWebAppScore = normalizeInput(core.getInput('minProgressiveWebAppScore'));
    const minSeoScore = normalizeInput(core.getInput('minSeoScore'));

    const results = await lighthouseCheck({
      author: normalizeInput(core.getInput('author')),
      apiToken: normalizeInput(core.getInput('apiToken')),
      awsAccessKeyId: normalizeInput(core.getInput('awsAccessKeyId')),
      awsBucket: normalizeInput(core.getInput('awsBucket')),
      awsRegion: normalizeInput(core.getInput('awsRegion')),
      awsSecretAccessKey: normalizeInput(core.getInput('awsSecretAccessKey')),
      branch: normalizeInput(core.getInput('branch')),
      configFile: normalizeInput(core.getInput('configFile')),
      emulatedFormFactor: normalizeInput(core.getInput('emulatedFormFactor')),
      locale: normalizeInput(core.getInput('locale')),
      help: normalizeInput(core.getInput('help')),
      outputDirectory: normalizeInput(core.getInput('outputDirectory')),
      pr: normalizeInput(core.getInput('pr')),
      sha: normalizeInput(core.getInput('sha')),
      slackWebhookUrl: normalizeInput(core.getInput('slackWebhookUrl')),
      tag: normalizeInput(core.getInput('tag')),
      timeout: normalizeInput(core.getInput('timeout')),
      throttling: normalizeInput(core.getInput('throttling')),
      throttlingMethod: normalizeInput(core.getInput('throttlingMethod')),
      urls: !urls ? undefined : urls.split(','),
      verbose: normalizeInput(core.getInput('verbose')),
      wait: normalizeInput(core.getInput('wait'))
    });

    // if we need to fail when scores are too low...
    if (minAccessibilityScore || minBestPracticesScore
      || minPerformanceScore || minProgressiveWebAppScore || minSeoScore) {
      const failures = getFailureMessages({
        minAccessibilityScore,
        minBestPracticesScore,
        minPerformanceScore,
        minProgressiveWebAppScore,
        minSeoScore,
        results
      });

      console.log('failures', failures);

      // if we have scores that were below the minimum requirement
      if (failures.length) {
        // comma-separate error messages and remove the last comma
        const failureMessage = failures.join().slice(0, -1);
        throw new Error(`Minimum score requirements failed. ${failureMessage}`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();

