/**
 * Authentication Flow Tests
 * Tests user registration, login, and logout functionality
 */

describe('Authentication Flows', () => {
	const timestamp = Date.now();
	const testEmail = `test-${timestamp}@example.com`;
	const testPassword = 'SecurePass123!';
	const testName = 'Test User';

	beforeEach(() => {
		cy.clearCookies();
		cy.clearLocalStorage();
	});

	describe('User Registration', () => {
		it('should register a new user successfully', () => {
			cy.visit('/signup');

			cy.get('input[type="email"]').type(testEmail);
			cy.get('input[type="password"]').first().type(testPassword);
			cy.get('input[name="name"]').type(testName);

			cy.get('button[type="submit"]').click();

			cy.url().should('include', '/dashboard');
			cy.contains(testName).should('be.visible');
		});

		it('should show error for existing email', () => {
			// Register first time
			cy.register(testEmail, testPassword, testName);

			// Try to register again
			cy.visit('/signup');
			cy.get('input[type="email"]').type(testEmail);
			cy.get('input[type="password"]').first().type(testPassword);
			cy.get('input[name="name"]').type(testName);

			cy.get('button[type="submit"]').click();

			cy.contains(/already exists|taken/i).should('be.visible');
		});

		it('should validate password requirements', () => {
			cy.visit('/signup');

			cy.get('input[type="email"]').type(`new-${timestamp}@example.com`);
			cy.get('input[type="password"]').first().type('weak');
			cy.get('input[name="name"]').type(testName);

			cy.get('button[type="submit"]').click();

			cy.contains(/password|strong|requirements/i).should('be.visible');
		});
	});

	describe('User Login', () => {
		beforeEach(() => {
			// Ensure user exists
			cy.visit('/signup');
			cy.get('input[type="email"]').clear().type(testEmail);
			cy.get('input[type="password"]').first().clear().type(testPassword);
			cy.get('input[name="name"]').clear().type(testName);
			cy.get('button[type="submit"]').click();
			cy.wait(1000);
			cy.visit('/logout');
		});

		it('should login with correct credentials', () => {
			cy.login(testEmail, testPassword);

			cy.url().should('not.include', '/login');
			cy.contains(testName).should('be.visible');
		});

		it('should show error for wrong password', () => {
			cy.visit('/login');

			cy.get('input[type="email"]').type(testEmail);
			cy.get('input[type="password"]').type('WrongPassword123!');
			cy.get('button[type="submit"]').click();

			cy.contains(/invalid|incorrect|wrong/i).should('be.visible');
		});

		it('should show error for non-existent user', () => {
			cy.visit('/login');

			cy.get('input[type="email"]').type(`nonexistent-${timestamp}@example.com`);
			cy.get('input[type="password"]').type(testPassword);
			cy.get('button[type="submit"]').click();

			cy.contains(/not found|invalid|incorrect/i).should('be.visible');
		});

		it('should implement account locking after failed attempts', () => {
			cy.visit('/login');

			// Attempt login 5 times with wrong password
			for (let i = 0; i < 5; i++) {
				cy.get('input[type="email"]').clear().type(testEmail);
				cy.get('input[type="password"]').clear().type('WrongPassword');
				cy.get('button[type="submit"]').click();
				cy.wait(500);
			}

			// 6th attempt should show account locked message
			cy.get('input[type="email"]').clear().type(testEmail);
			cy.get('input[type="password"]').clear().type(testPassword);
			cy.get('button[type="submit"]').click();

			cy.contains(/locked|too many attempts/i).should('be.visible');
		});
	});

	describe('Session Management', () => {
		it('should persist session across page reloads', () => {
			cy.login(testEmail, testPassword);

			cy.reload();

			cy.contains(testName).should('be.visible');
			cy.url().should('not.include', '/login');
		});

		it('should logout successfully', () => {
			cy.login(testEmail, testPassword);

			// Click logout button
			cy.get('button, a')
				.contains(/logout|sign out/i)
				.click();

			cy.url().should('not.include', '/dashboard');

			// Verify cannot access dashboard
			cy.visit('/dashboard');
			cy.url().should('include', '/login');
		});
	});

	describe('Protected Routes', () => {
		it('should redirect unauthenticated users to login', () => {
			cy.visit('/dashboard');

			cy.url().should('include', '/login');
		});

		it('should allow authenticated users to access dashboard', () => {
			cy.login(testEmail, testPassword);

			cy.visit('/dashboard');

			cy.url().should('include', '/dashboard');
			cy.contains(/dashboard|trees/i).should('be.visible');
		});
	});
});
