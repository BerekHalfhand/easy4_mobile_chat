module.exports = {
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/tests/**/*.test.(ts|js)'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js']
};
