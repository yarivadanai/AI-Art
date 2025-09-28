import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from '../../tsconfig.base.json';

const pathMapper = pathsToModuleNameMapper(compilerOptions.paths ?? {}, {
  prefix: '<rootDir>/../../',
});

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testMatch: ['**/?(*.)+(spec|e2e-spec).ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  setupFiles: ['reflect-metadata'],
  moduleNameMapper: {
    '^@hit-arc/engine$': '<rootDir>/../../packages/engine/src/index.ts',
    '^@hit-arc/engine/(.*)$': '<rootDir>/../../packages/engine/src/$1',
    '^@hit-arc/ui$': '<rootDir>/../../packages/ui/src/index.ts',
    '^@hit-arc/ui/(.*)$': '<rootDir>/../../packages/ui/src/$1',
    ...pathMapper,
    '^(.+)\\.js$': '$1',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
