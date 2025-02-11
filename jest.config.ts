export default {
    projects: [
        {
            displayName: 'react',
            preset: 'ts-jest',
            setupFilesAfterEnv: ['@testing-library/jest-dom'],
            testEnvironment: 'jest-environment-jsdom',
            moduleNameMapper: {
                '^@assets/(.*)$': '<rootDir>/src/assets/$1',
                '^@core/(.*)$': '<rootDir>/src/core/$1',
                '^@utils/(.*)$': '<rootDir>/src/utils/$1',
                '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Handle CSS imports in React
            },
            transform: {
                '^.+\\.(ts|tsx)$': 'ts-jest'
            },
            testMatch: ['**/*.test.{ts,tsx}'],
            testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/'],
            globals: {
                'ts-jest': {
                    tsconfig: '<rootDir>/tsconfig.json'
                }
            },
        }
    ]
};
