// https://developers.google.com/web/tools/lighthouse/v3/scoring
export default ({ isHex, score }) => {
  if (typeof score !== 'number') {
    return !isHex ? 'lightgrey' : '#e0e0e0';
  }

  let scoreColor = !isHex ? 'green' : '#0cce6b';

  // medium range
  if (score < 90) {
    scoreColor = !isHex ? 'orange' : '#ffa400';
  }

  // bad
  if (score < 50) {
    scoreColor = !isHex ? 'red' : '#f74531';
  }

  return scoreColor;
};
