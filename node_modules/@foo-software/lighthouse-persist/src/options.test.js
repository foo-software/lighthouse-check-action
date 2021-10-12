import options from './options';

describe('options', () => {
  it('should match snapshot', () => {
    expect(options).toMatchSnapshot();
  });
});
