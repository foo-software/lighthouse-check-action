import Util from 'lighthouse-legacy/lighthouse-core/report/html/renderer/util';
export { Util };

// inspired by:
// https://github.com/GoogleChrome/lighthouse/blob/2e9c3c9b5f7d75b39be9d1e2ba116d49cf811f81/lighthouse-core/report/html/renderer/performance-category-renderer.js#L97
const getWastedMs = audit => {
  if (audit.result.details && audit.result.details.type === 'opportunity') {
    const details = audit.result.details;
    if (typeof details.overallSavingsMs !== 'number') {
      throw new Error('non-opportunity details passed to getWastedMs');
    }
    return details.overallSavingsMs;
  } else {
    return Number.MIN_VALUE;
  }
};

// inspired by:
// https://github.com/GoogleChrome/lighthouse/blob/2e9c3c9b5f7d75b39be9d1e2ba116d49cf811f81/lighthouse-core/report/html/renderer/performance-category-renderer.js#L224-L226
export default result =>
  result.categories.performance.auditRefs
    .reduce((accumulator, audit) => {
      const auditResult = result.audits[audit.id];
      if (
        audit.group !== 'load-opportunities' ||
        Util.showAsPassed(auditResult)
      ) {
        return accumulator;
      }

      return [
        ...accumulator,
        {
          ...audit,
          result: {
            ...auditResult,

            // "average" | "fail" | "pass" | ...
            rating: Util.calculateRating(
              auditResult.score,
              auditResult.scoreDisplayMode
            )
          }
        }
      ];
    }, [])
    .sort((auditA, auditB) => getWastedMs(auditB) - getWastedMs(auditA));
