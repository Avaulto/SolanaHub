export default {
  displayName: "SolanaHub",
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ["<rootDir>/src/test.ts"],
  coverageDirectory: "./coverage",
  coverageReporters: [["lcov", { projectRoot: __dirname }]],
  testMatch: ["**/*.spec.ts"],
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.(html|svg)$",
      },
    ],
  },
  transformIgnorePatterns: ["node_modules/(?!.*\\.mjs$) (?!echarts)"],
  snapshotSerializers: [
    "jest-preset-angular/build/serializers/no-ng-attributes",
    "jest-preset-angular/build/serializers/ng-snapshot",
    "jest-preset-angular/build/serializers/html-comment",
  ],
};
