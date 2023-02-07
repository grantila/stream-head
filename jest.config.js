export default {
	resolver: "ts-jest-resolver",
	testEnvironment: 'node',
	testMatch: [ '<rootDir>/lib/**/*.spec.ts' ],
	collectCoverageFrom: [ '<rootDir>/lib/**' ],
	coverageReporters: [ 'lcov', 'text', 'html' ],
	testTimeout: 100,
	extensionsToTreatAsEsm: ['.ts'],
};
