// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Prevent TypeScript errors for custom commands
declare global {
	namespace Cypress {
		interface Chainable {
			/**
			 * Custom command to login via UI
			 * @example cy.login('user@example.com', 'password123')
			 */
			login(email: string, password: string): Chainable<void>;

			/**
			 * Custom command to register a new user via UI
			 * @example cy.register('user@example.com', 'password123', 'John Doe')
			 */
			register(email: string, password: string, name: string): Chainable<void>;

			/**
			 * Custom command to create a tree
			 * @example cy.createTree('My Tree', 'Christmas', 'Description')
			 */
			createTree(title: string, theme: string, description?: string): Chainable<void>;
		}
	}
}

export {};
