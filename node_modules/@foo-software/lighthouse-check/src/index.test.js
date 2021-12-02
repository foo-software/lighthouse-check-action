import * as lighthouseCheckApi from '.';

describe('@foo-software/lighthouse-check', () => {
  it('should match snapshot', () => {
    expect(lighthouseCheckApi).toMatchSnapshot();
  });
});
