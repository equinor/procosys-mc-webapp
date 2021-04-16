module.exports = {
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        '/node_modules/(?!(@equinor/eds-tokens|@equinor/eds-icons))',
    ],
    transform: {
        '^.+\\.(js|ts|tsx)$': 'ts-jest',
        '^.+\\.(svg|png)$': '<rootDir>/src/test/imgTransform.js',
    },
    globals: {
        crypto: require('crypto'),
    },
    setupFilesAfterEnv: ['<rootDir>/src/test/setupTests.ts'],
};
