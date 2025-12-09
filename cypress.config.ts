import { defineConfig } from 'cypress';

export default defineConfig({
	e2e: {
		baseUrl: 'http://localhost:3000',
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
		supportFile: 'cypress/support/e2e.ts',
		video: true,
		screenshotOnRunFailure: true,
		viewportWidth: 1280,
		viewportHeight: 720,
		defaultCommandTimeout: 10000,
		requestTimeout: 10000,
		responseTimeout: 10000,
		env: {
			// Test user credentials
			TEST_EMAIL: 'test@example.com',
			TEST_PASSWORD: 'TestPassword123!',
		},
	},
});
