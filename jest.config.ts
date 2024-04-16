export default {
  displayName: "SolanaHub",
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ["<rootDir>/src/test.ts"],
  testMatch: ["**/*.spec.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/src/app/shared/components/animated-icon",
    "<rootDir>src/app/shared/layouts/wallet/wallet-connect/wallet-connect.component.spec.ts",

    "<rootDir>/src/app/app.component.spec.ts",

    "<rootDir>/src/app/pages/dao/dao.page.spec.ts",
  ],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "^node_modules/(.*)$": "<rootDir>/node_modules/$1"
  },
  transform: {
    "^.+\\.(ts|mjs|js|html)$": [
      "jest-preset-angular",
      {
        tsconfig: "<rootDir>/tsconfig.spec.json",
        stringifyContentPathRegex: "\\.(html|svg)$",
        isolatedModules: true,
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
