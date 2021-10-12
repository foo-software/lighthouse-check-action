import getLighthouseAuditTitlesByKey from './getLighthouseAuditTitlesByKey';

describe('getLighthouseAuditTitlesByKey', () => {
  it('should return the correct value of a command argument', () => {
    const expected = [
      'Accessibility',
      'Best Practices',
      'Performance',
      'Progressive Web App',
      'SEO'
    ];

    const actual = getLighthouseAuditTitlesByKey([
      'accessibility',
      'bestPractices',
      'performance',
      'progressiveWebApp',
      'seo'
    ]);

    expect(actual).toEqual(expected);
  });
});
