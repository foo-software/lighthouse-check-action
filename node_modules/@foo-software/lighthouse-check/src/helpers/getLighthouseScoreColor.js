// https://developers.google.com/web/tools/lighthouse/v3/scoring
export default score => {
  if (typeof score !== 'number') {
    return '#e0e0e0';
  }

  let scoreColor = '#0cce6b';

  // medium range
  if (score < 75) {
    scoreColor = '#ffa400';
  }

  // bad
  if (score < 45) {
    scoreColor = '#f74531';
  }

  return scoreColor;
};
