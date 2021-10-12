jest.mock('node-fetch');

import fetch from 'node-fetch';
import getPageSpeedInsightsApiResult from './getPageSpeedInsightsApiResult';

jest.mock('lighthouse', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    lighthouseResult: {
      mock: true
    },
    loadingExperience: {
      mock: true
    },
    originLoadingExperience: {
      mock: true
    }
  })
}));

describe('getPageSpeedInsightsApiResult', () => {
  const params = {
    psiKey: 'abc',
    strategy: 'desktop',
    url: 'https://www.foo.software'
  };

  it('should call node-fetch correctly and return data', async () => {
    fetch.mockReturnValue({
      json: () => ({ mockResult: true })
    });
    const response = await getPageSpeedInsightsApiResult(params);
    expect(fetch).toHaveBeenCalledWith(
      'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fwww.foo.software&category=ACCESSIBILITY&category=BEST_PRACTICES&category=PERFORMANCE&category=PWA&category=SEO&strategy=desktop&key=abc'
    );
    expect(response).toEqual({ mockResult: true });
  });
});
