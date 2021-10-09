// https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed
import fetch from 'node-fetch';

const PSI_API_URL =
  'https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed';

export default async ({ psiKey, strategy, url }) => {
  const psiApiUrl = `${PSI_API_URL}?url=${encodeURIComponent(
    url
  )}&category=ACCESSIBILITY&category=BEST_PRACTICES&category=PERFORMANCE&category=PWA&category=SEO&strategy=${strategy}&key=${psiKey}`;
  const psiResponse = await fetch(psiApiUrl);
  return psiResponse.json();
};
