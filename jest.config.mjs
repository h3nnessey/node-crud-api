export default {
  testEnvironment: 'node',
  preset: 'ts-jest',
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleDirectories: ['<rootDir>/src', 'node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
};
