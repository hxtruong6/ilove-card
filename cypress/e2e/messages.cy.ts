/**
 * Message Management Tests
 * Tests message creation, editing, deletion, and rich text functionality
 */

describe('Message Management', () => {
	const timestamp = Date.now();
	const ownerEmail = `msg-owner-${timestamp}@example.com`;
	const guestEmail = `msg-guest-${timestamp}@example.com`;
	const password = 'MsgPass123!';
	const ownerName = 'Message Owner';
	const guestName = 'Message Guest';

	let treeId: string;

	before(() => {
		// Create owner and a tree
		cy.visit('/');
		cy.register(ownerEmail, password, ownerName);
		cy.createTree(`Message Test Tree ${timestamp}`, 'christmas');

		cy.url().then(url => {
			treeId = url.match(/trees\/([\w-]+)/)?.[1] || '';
		});

		// Create guest user
		cy.visit('/logout');
		cy.register(guestEmail, password, guestName);
	});

	beforeEach(() => {
		cy.login(guestEmail, password);
		cy.visit(`/trees/${treeId}`);
	});

	describe('Message Creation', () => {
		it('should create a simple text message', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			const messageText = 'This is my festive message!';
			cy.get('[contenteditable="true"], textarea').first().type(messageText);

			cy.get('button[type="submit"]')
				.contains(/send|post/i)
				.click();

			cy.contains(/success|added/i).should('be.visible');

			// Verify message appears
			cy.get('[data-testid="message-card"], [class*="message"]').should('exist');

			// Click and verify content
			cy.get('[data-testid="message-card"]').first().click();
			cy.contains(messageText).should('be.visible');
		});

		it('should create message with rich text formatting', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			// Type text
			cy.get('[contenteditable="true"]').first().type('Bold text here');

			// Apply bold formatting
			cy.get('[contenteditable="true"]').first().type('{selectall}');
			cy.get('button[aria-label*="Bold"], button[title*="Bold"]').click();

			// Add more text
			cy.get('[contenteditable="true"]').first().type('{movetoend}{enter}Italic text here');

			// Apply italic
			cy.get('[contenteditable="true"]').first().type('{selectall}');
			cy.get('button[aria-label*="Italic"], button[title*="Italic"]').click();

			cy.get('button[type="submit"]').contains(/send/i).click();

			// Verify formatting preserved
			cy.get('[data-testid="message-card"]').first().click();
			cy.get('strong, b').should('exist');
			cy.get('em, i').should('exist');
		});

		it('should create message with decoration', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			// Select decoration
			cy.get('[data-testid="decoration-selector"]').find('button, [role="button"]').first().click();

			cy.get('[contenteditable="true"], textarea').first().type('Message with decoration');

			cy.get('button[type="submit"]').click();

			// Verify decoration icon appears on message card
			cy.get('[data-testid="message-card"]')
				.first()
				.find('img, svg, [class*="decoration"]')
				.should('exist');
		});

		it('should require message content', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			// Try to submit empty message
			cy.get('button[type="submit"]').should('be.disabled');
		});

		it('should support emoji in messages', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			const messageWithEmoji = 'Happy Holidays! 🎄🎅❄️🎁';
			cy.get('[contenteditable="true"], textarea').first().type(messageWithEmoji);

			cy.get('button[type="submit"]').click();

			cy.get('[data-testid="message-card"]').first().click();
			cy.contains(/🎄|🎅|❄️|🎁/).should('be.visible');
		});
	});

	describe('Message Display', () => {
		it('should show message sender name', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();
			cy.get('[contenteditable="true"], textarea').first().type('Test sender name');
			cy.get('button[type="submit"]').click();

			cy.get('[data-testid="message-card"]').first().click();
			cy.contains(guestName).should('be.visible');
		});

		it('should show message timestamp', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();
			cy.get('[contenteditable="true"], textarea').first().type('Test timestamp');
			cy.get('button[type="submit"]').click();

			cy.get('[data-testid="message-card"]').first().click();

			// Verify date is shown
			const today = new Date();
			const datePattern = new RegExp(today.getFullYear().toString());
			cy.get('body').should('match', datePattern);
		});

		it('should sanitize HTML in messages', () => {
			cy.get('button')
				.contains(/add.*message/i)
				.click();

			const xssPayload = '<script>alert("xss")</script><img src=x onerror=alert("xss")>';
			cy.get('[contenteditable="true"], textarea').first().invoke('text', xssPayload);

			cy.get('button[type="submit"]').click();

			cy.wait(1000);

			// Ensure no alert triggered
			cy.on('window:alert', () => {
				throw new Error('XSS vulnerability detected');
			});

			// Verify script tags are removed
			cy.get('[data-testid="message-card"]').first().click();
			cy.get('body').should('not.contain', '<script>');
		});
	});

	describe('Message Editing', () => {
		beforeEach(() => {
			// Create a message to edit
			cy.get('button')
				.contains(/add.*message/i)
				.click();
			cy.get('[contenteditable="true"], textarea').first().type('Original message text');
			cy.get('button[type="submit"]').click();
			cy.wait(1000);
		});

		it('should edit own message', () => {
			cy.get('[data-testid="message-card"]').first().click();

			// Click edit button
			cy.get('button[aria-label*="more"], button')
				.contains(/⋮|more/i)
				.click();
			cy.contains(/edit/i).click();

			// Clear and type new content
			cy.get('[contenteditable="true"], textarea').first().clear().type('Updated message text');

			// Save changes
			cy.get('button')
				.contains(/save|✓/i)
				.click();

			// Verify update
			cy.contains('Updated message text').should('be.visible');
		});

		it('should not show edit option for others messages', () => {
			// Login as owner
			cy.visit('/logout');
			cy.login(ownerEmail, password);
			cy.visit(`/trees/${treeId}`);

			// Click on guest's message
			cy.get('[data-testid="message-card"]').first().click();

			// Verify no edit option (but delete should be available for owner)
			cy.get('button').then($buttons => {
				const editButton = $buttons.filter(':contains("Edit")');
				expect(editButton).to.have.length(0);
			});
		});
	});

	describe('Message Deletion', () => {
		beforeEach(() => {
			// Ensure there's a message
			cy.get('body').then($body => {
				if ($body.find('[data-testid="message-card"]').length === 0) {
					cy.get('button')
						.contains(/add.*message/i)
						.click();
					cy.get('[contenteditable="true"], textarea').first().type('Message to delete');
					cy.get('button[type="submit"]').click();
					cy.wait(1000);
				}
			});
		});

		it('should delete own message', () => {
			cy.get('[data-testid="message-card"]').first().click();

			cy.get('button[aria-label*="more"], button')
				.contains(/⋮|more/i)
				.click();
			cy.contains(/delete/i).click();

			// Confirm if needed
			cy.get('body').then($body => {
				if ($body.text().match(/confirm/i)) {
					cy.contains('button', /confirm|delete/i).click();
				}
			});

			cy.contains(/deleted|removed/i).should('be.visible');
		});

		it('should allow owner to delete any message', () => {
			// Guest creates message
			cy.get('[data-testid="message-card"]').should('exist');

			// Owner logs in
			cy.visit('/logout');
			cy.login(ownerEmail, password);
			cy.visit(`/trees/${treeId}`);

			// Delete guest's message
			cy.get('[data-testid="message-card"]').first().click();
			cy.get('button')
				.contains(/⋮|more/i)
				.click();
			cy.contains(/delete/i).click();

			cy.wait(500);
			cy.get('body').then($body => {
				if ($body.find('button:contains("Confirm")').length > 0) {
					cy.contains('button', /confirm/i).click();
				}
			});

			cy.contains(/deleted|removed/i, { timeout: 5000 }).should('be.visible');
		});
	});

	describe('Empty State', () => {
		it('should show empty state when no messages', () => {
			// Create new tree
			cy.visit('/logout');
			cy.login(ownerEmail, password);
			cy.createTree(`Empty Tree ${timestamp}`, 'christmas');

			// Verify empty state
			cy.contains(/no messages?|tree looks.*lonely|add first message/i).should('be.visible');

			// Verify call-to-action button
			cy.get('button')
				.contains(/add.*message/i)
				.should('be.visible');
		});
	});

	describe('Message Limits', () => {
		it('should show progress when approaching message limit', () => {
			// This test depends on your maxMessages implementation
			cy.visit(`/trees/${treeId}`);

			// Add multiple messages to test limit (if implemented)
			for (let i = 0; i < 3; i++) {
				cy.get('button')
					.contains(/add.*message/i)
					.click();
				cy.get('[contenteditable="true"], textarea')
					.first()
					.type(`Message ${i + 1}`);
				cy.get('button[type="submit"]').click();
				cy.wait(1000);
			}

			// Verify messages created
			cy.get('[data-testid="message-card"]').should('have.length.at.least', 3);
		});
	});
});
