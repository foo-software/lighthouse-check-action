module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node",
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/dist/"
  ],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
};
