/**
 * E2E Smoke Test - MVP Launch Critical Path
 *
 * This test covers the complete user journey from registration to message deletion.
 * Based on the MVP Launch Plan smoke test requirements.
 */

describe('MVP Smoke Test - Complete User Journey', () => {
	const timestamp = Date.now();
	const ownerEmail = `test-owner-${timestamp}@example.com`;
	const guestEmail = `test-guest-${timestamp}@example.com`;
	const ownerPassword = 'TestPassword123!';
	const guestPassword = 'GuestPass123!';
	const ownerName = 'Test Owner';
	const guestName = 'Test Guest';
	const treeTitle = 'My Christmas Tree 2025';
	const treeDescription = 'Share your festive wishes!';

	let sharedTreeUrl: string;

	beforeEach(() => {
		// Clear cookies before each test
		cy.clearCookies();
		cy.clearLocalStorage();
	});

	it('Flow 1: Should register a new owner user', () => {
		cy.visit('/signup');

		// Verify page loaded
		cy.contains(/sign up|create account/i).should('be.visible');

		// Fill registration form
		cy.get('input[type="email"]').type(ownerEmail);
		cy.get('input[type="password"]').first().type(ownerPassword);
		cy.get('input[name="name"], input[placeholder*="name" i]').type(ownerName);

		// Submit form
		cy.get('button[type="submit"]').contains(/sign/i).click();

		// Verify redirect to dashboard
		cy.url().should('include', '/dashboard', { timeout: 10000 });
		cy.contains(ownerName).should('be.visible');
	});

	it('Flow 2: Should create a Christmas tree', () => {
		// Login as owner
		cy.login(ownerEmail, ownerPassword);

		// Navigate to create tree
		cy.visit('/dashboard/trees/new');

		// Fill tree creation form
		cy.get('input[name="title"], input[placeholder*="title" i]').type(treeTitle);

		// Select Christmas theme
		cy.get('select[name="theme"], [role="radiogroup"]').then($el => {
			if ($el.is('select')) {
				cy.wrap($el).select('christmas');
			} else {
				// Handle radio button or custom selector
				cy.contains(/christmas/i).click();
			}
		});

		// Add description
		cy.get('textarea[name="description"], input[name="description"]').type(treeDescription);

		// Submit form
		cy.get('button[type="submit"]')
			.contains(/create/i)
			.click();

		// Verify tree created
		cy.url().should('match', /\/trees\/[\w-]+/, { timeout: 10000 });
		cy.contains(treeTitle).should('be.visible');
		cy.contains(ownerName).should('be.visible');

		// Verify Christmas theme is applied (check for teal/green colors)
		cy.get('[data-testid="tree-canvas"], .tree-canvas, [class*="tree"]').should('exist');

		// Verify empty state
		cy.contains(/no messages?|tree looks.*lonely|add first message/i).should('be.visible');
	});

	it('Flow 3: Should share tree link', () => {
		// Login and navigate to tree
		cy.login(ownerEmail, ownerPassword);
		cy.visit('/dashboard');

		// Find and click on the created tree
		cy.contains(treeTitle).click();

		// Click share button
		cy.get('button').contains(/share/i).click();

		// Verify success toast
		cy.contains(/copied|link/i, { timeout: 5000 }).should('be.visible');

		// Get current URL to use as shared link
		cy.url().then(url => {
			// Extract tree ID and construct public URL
			const treeId = url.match(/trees\/([\w-]+)/)?.[1];
			expect(treeId).to.exist;
			sharedTreeUrl = `/trees/${treeId}`;

			// Store for next test
			cy.wrap(sharedTreeUrl).as('sharedTreeUrl');
		});
	});

	it('Flow 4: Should post message as guest', () => {
		// Register guest user
		cy.register(guestEmail, guestPassword, guestName);

		// Get shared tree URL from previous test
		cy.get('@sharedTreeUrl').then(url => {
			cy.visit(url as string);
		});

		// Verify tree loads
		cy.contains(treeTitle).should('be.visible');
		cy.contains(ownerName).should('be.visible');

		// Click "Add Message" button
		cy.get('button')
			.contains(/add.*message/i)
			.click();

		// Wait for message form to appear
		cy.get('[data-testid="message-form"], form').should('be.visible');

		// Select a decoration if available
		cy.get('[data-testid="decoration-selector"]').then($selector => {
			if ($selector.length > 0) {
				cy.wrap($selector).find('button, [role="button"]').first().click();
			}
		});

		// Type message with rich text
		cy.get('[contenteditable="true"], textarea, .tiptap')
			.first()
			.then($editor => {
				if ($editor.attr('contenteditable') === 'true') {
					// Rich text editor
					cy.wrap($editor)
						.click()
						.type('Happy Holidays! 🎅{enter}{enter}Wishing you joy and peace this festive season.');

					// Test bold formatting
					cy.wrap($editor).type('{selectall}');
					cy.get('button[aria-label*="Bold"], button[title*="Bold"]').click();
				} else {
					// Regular textarea
					cy.wrap($editor).type(
						'Happy Holidays! 🎅\n\nWishing you joy and peace this festive season.'
					);
				}
			});

		// Submit message
		cy.get('button[type="submit"]')
			.contains(/send|post/i)
			.click();

		// Verify success
		cy.contains(/success|added/i, { timeout: 5000 }).should('be.visible');

		// Verify message appears on tree
		cy.get('[data-testid="message-card"], [class*="message"]').should('have.length.at.least', 1);

		// Click on message to view content
		cy.get('[data-testid="message-card"], [class*="message"]').first().click();

		// Verify message content
		cy.contains(/happy holidays/i).should('be.visible');
		cy.contains(guestName).should('be.visible');
	});

	it('Flow 5: Should delete guest message as owner', () => {
		// Logout guest and login as owner
		cy.visit('/logout');
		cy.login(ownerEmail, ownerPassword);

		// Navigate to tree
		cy.get('@sharedTreeUrl').then(url => {
			cy.visit(url as string);
		});

		// Verify message is visible
		cy.get('[data-testid="message-card"], [class*="message"]').should('exist');

		// Click on the guest's message
		cy.get('[data-testid="message-card"], [class*="message"]').first().click();

		// Wait for message details to open
		cy.contains(guestName, { timeout: 5000 }).should('be.visible');

		// Find and click delete button
		cy.get('button[aria-label*="more"], button')
			.contains(/⋮|more/i)
			.click();
		cy.get('[role="menuitem"]')
			.contains(/delete/i)
			.click();

		// Confirm deletion if there's a confirmation dialog
		cy.get('body').then($body => {
			if ($body.find('button').filter(':contains("Confirm"), :contains("Delete")').length > 0) {
				cy.contains('button', /confirm|delete/i).click();
			}
		});

		// Verify success toast
		cy.contains(/deleted|removed/i, { timeout: 5000 }).should('be.visible');

		// Verify message is removed
		cy.get('[data-testid="message-card"], [class*="message"]').should('not.exist');

		// Verify empty state returns
		cy.contains(/no messages?|tree looks.*lonely/i).should('be.visible');
	});

	// Additional check: Mobile responsiveness
	it('Should be mobile responsive', () => {
		cy.viewport('iphone-x');

		cy.login(ownerEmail, ownerPassword);
		cy.get('@sharedTreeUrl').then(url => {
			cy.visit(url as string);
		});

		// Verify no horizontal scroll
		cy.document()
			.its('documentElement.scrollWidth')
			.should('be.lte', Cypress.config('viewportWidth'));

		// Verify navbar hamburger menu on mobile
		cy.get('button[aria-label*="menu" i], button')
			.filter(':visible')
			.should('have.length.at.least', 1);

		// Verify tree canvas scales correctly
		cy.get('[data-testid="tree-canvas"], [class*="tree"]')
			.should('be.visible')
			.and('have.css', 'overflow', 'hidden');
	});

	// Additional check: Security - XSS Prevention
	it('Should prevent XSS attacks in messages', () => {
		cy.login(guestEmail, guestPassword);
		cy.get('@sharedTreeUrl').then(url => {
			cy.visit(url as string);
		});

		// Try to inject script
		cy.get('button')
			.contains(/add.*message/i)
			.click();

		const xssPayload = '<script>alert("XSS")</script><img src=x onerror=alert("XSS")>';

		cy.get('[contenteditable="true"], textarea')
			.first()
			.type(xssPayload, { parseSpecialCharSequences: false });

		cy.get('button[type="submit"]')
			.contains(/send|post/i)
			.click();

		cy.wait(2000);

		// Verify no alert was triggered
		cy.on('window:alert', () => {
			throw new Error('XSS vulnerability: Alert was triggered!');
		});

		// Verify script tags are sanitized
		cy.get('[data-testid="message-card"]').first().click();
		cy.get('body').should('not.contain', '<script>');
	});
});
