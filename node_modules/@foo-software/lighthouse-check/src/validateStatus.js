import fs from 'fs';
import path from 'path';
import LighthouseCheckError from './LighthouseCheckError';
import { NAME, NAME_RESULTS_JSON_FILE } from './constants';
import { ERROR_INVALID } from './errorCodes';

const getScoreFailMessage = ({ name, url, minScore, score }) => {
  // if inputs are not specified - assume we shouldn't fail
  if (typeof minScore === 'undefined' || typeof score === 'undefined') {
    return [];
  }

  if (Number(score) < Number(minScore)) {
    return [
      `${url}: ${name}: minimum score: ${minScore}, actual score: ${score}`
    ];
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
}) =>
  results.reduce(
    (accumulator, current) => [
      ...accumulator,
      ...getScoreFailMessage({
        name: 'Accessibility',
        minScore: minAccessibilityScore,
        score: current.scores.accessibility,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Best Practices',
        minScore: minBestPracticesScore,
        score: current.scores.bestPractices,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Performance',
        minScore: minPerformanceScore,
        score: current.scores.performance,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'Progressive Web App',
        minScore: minProgressiveWebAppScore,
        score: current.scores.progressiveWebApp,
        ...current
      }),
      ...getScoreFailMessage({
        name: 'SEO',
        minScore: minSeoScore,
        score: current.scores.seo,
        ...current
      })
    ],
    []
  );

export default async ({
  minAccessibilityScore,
  minBestPracticesScore,
  minPerformanceScore,
  minProgressiveWebAppScore,
  minSeoScore,
  outputDirectory,
  results,
  verbose
}) => {
  let resultsJson = results;

  if (outputDirectory && !resultsJson) {
    const outputDirectoryPath = path.resolve(outputDirectory);
    const resultsJsonFile = `${outputDirectoryPath}/${NAME_RESULTS_JSON_FILE}`;
    const resultsJsonString = fs.readFileSync(resultsJsonFile).toString();
    resultsJson = JSON.parse(resultsJsonString);
  }

  const failures = getFailureMessages({
    minAccessibilityScore,
    minBestPracticesScore,
    minPerformanceScore,
    minProgressiveWebAppScore,
    minSeoScore,
    results: resultsJson
  });

  // if we have scores that were below the minimum requirement
  if (failures.length) {
    // comma-separate error messages and remove the last comma
    const failureMessage = failures.join('\n');
    throw new LighthouseCheckError(
      `Minimum score requirements failed:\n${failureMessage}`,
      {
        code: ERROR_INVALID
      }
    );
  }

  if (verbose) {
    console.log(`${NAME}:`, 'Scores passed minimum requirement ✅');
  }

  return true;
};
