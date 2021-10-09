import { Util } from './getOpportunities';

describe('Util', () => {
  it('Util.calculateRating should be a function', () => {
    expect(typeof Util.calculateRating).toBe('function');
  });
  it('Util.showAsPassed should be a function', () => {
    expect(typeof Util.showAsPassed).toBe('function');
  });
});
