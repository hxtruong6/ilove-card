/// <reference types="cypress" />

/**
 * Custom Cypress Commands for iCard Testing
 */

/**
 * Login command - logs in a user via the UI
 */
Cypress.Commands.add('login', (email: string, password: string) => {
	cy.visit('/login');
	cy.get('input[type="email"]').type(email);
	cy.get('input[type="password"]').type(password);
	cy.get('button[type="submit"]')
		.contains(/sign in|login/i)
		.click();

	// Wait for redirect to dashboard or home
	cy.url().should('not.include', '/login');
});

/**
 * Register command - registers a new user via the UI
 */
Cypress.Commands.add('register', (email: string, password: string, name: string) => {
	cy.visit('/signup');
	cy.get('input[type="email"]').type(email);
	cy.get('input[type="password"]').first().type(password);
	cy.get('input[name="name"], input[placeholder*="name" i]').type(name);
	cy.get('button[type="submit"]')
		.contains(/sign up|register/i)
		.click();

	// Wait for successful registration
	cy.url().should('not.include', '/signup');
});

/**
 * Create Tree command - creates a new tree
 */
Cypress.Commands.add('createTree', (title: string, theme: string, description?: string) => {
	cy.visit('/dashboard/trees/new');

	cy.get('input[name="title"], input[placeholder*="title" i]').type(title);

	// Select theme if there's a dropdown or radio buttons
	cy.get('select[name="theme"]').select(theme).should('have.value', theme);

	if (description) {
		cy.get('textarea[name="description"], input[name="description"]').type(description);
	}

	cy.get('button[type="submit"]')
		.contains(/create/i)
		.click();

	// Wait for tree to be created
	cy.url().should('include', '/trees/');
});

export {};
