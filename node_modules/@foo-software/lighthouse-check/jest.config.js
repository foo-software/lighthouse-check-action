module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!meow)'],
};
