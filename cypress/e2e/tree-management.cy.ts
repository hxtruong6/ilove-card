/**
 * Tree Management Tests
 * Tests tree creation, editing, sharing, and deletion
 */

describe('Tree Management', () => {
	const timestamp = Date.now();
	const userEmail = `tree-owner-${timestamp}@example.com`;
	const userPassword = 'TreePass123!';
	const userName = 'Tree Owner';

	before(() => {
		// Create user for all tests
		cy.visit('/');
		cy.register(userEmail, userPassword, userName);
	});

	beforeEach(() => {
		cy.login(userEmail, userPassword);
	});

	describe('Tree Creation', () => {
		it('should create a Christmas tree successfully', () => {
			cy.visit('/dashboard/trees/new');

			const treeTitle = `Christmas Tree ${timestamp}`;
			const treeDescription = 'A festive Christmas tree for the family';

			cy.get('input[name="title"]').type(treeTitle);
			cy.get('select[name="theme"]').select('christmas');
			cy.get('textarea[name="description"]').type(treeDescription);

			cy.get('button[type="submit"]')
				.contains(/create/i)
				.click();

			cy.url().should('match', /\/trees\/[\w-]+/);
			cy.contains(treeTitle).should('be.visible');
			cy.contains(treeDescription).should('be.visible');
		});

		it('should create a Birthday tree', () => {
			cy.visit('/dashboard/trees/new');

			const treeTitle = `Birthday Tree ${timestamp}`;

			cy.get('input[name="title"]').type(treeTitle);
			cy.get('select[name="theme"]').select('birthday');

			cy.get('button[type="submit"]')
				.contains(/create/i)
				.click();

			cy.url().should('match', /\/trees\/[\w-]+/);
			cy.contains(treeTitle).should('be.visible');

			// Verify birthday theme styling (pink colors)
			cy.get('[data-testid="tree-canvas"], [class*="tree"]')
				.should('have.css', 'background')
				.and('match', /pink|purple/i);
		});

		it('should require tree title', () => {
			cy.visit('/dashboard/trees/new');

			cy.get('select[name="theme"]').select('christmas');
			cy.get('button[type="submit"]')
				.contains(/create/i)
				.click();

			cy.contains(/title.*required/i).should('be.visible');
		});

		it('should show created tree in dashboard list', () => {
			// Create a tree
			const treeTitle = `Dashboard Tree ${timestamp}`;
			cy.createTree(treeTitle, 'christmas');

			// Go to dashboard
			cy.visit('/dashboard');

			// Verify tree appears in list
			cy.contains(treeTitle).should('be.visible');
		});
	});

	describe('Tree Editing', () => {
		let treeUrl: string;
		const originalTitle = `Editable Tree ${timestamp}`;
		const updatedTitle = `Updated Tree ${timestamp}`;

		beforeEach(() => {
			// Create a tree to edit
			cy.createTree(originalTitle, 'christmas', 'Original description');
			cy.url().then(url => {
				treeUrl = url;
			});
		});

		it('should edit tree title and description', () => {
			cy.visit(treeUrl);

			// Click edit button
			cy.get('button').contains(/edit/i).click();

			// Update title
			cy.get('input[name="title"]').clear().type(updatedTitle);
			cy.get('textarea[name="description"]').clear().type('Updated description');

			// Save changes
			cy.get('button[type="submit"]')
				.contains(/save|update/i)
				.click();

			// Verify changes
			cy.contains(updatedTitle).should('be.visible');
			cy.contains('Updated description').should('be.visible');
		});
	});

	describe('Tree Sharing', () => {
		it('should generate shareable link', () => {
			const treeTitle = `Shareable Tree ${timestamp}`;
			cy.createTree(treeTitle, 'christmas');

			// Click share button
			cy.get('button').contains(/share/i).click();

			// Verify success message
			cy.contains(/copied|link/i).should('be.visible');

			// Verify tree is accessible from public URL
			cy.url().then(url => {
				const treeId = url.match(/trees\/([\w-]+)/)?.[1];
				expect(treeId).to.exist;

				// Logout and access tree
				cy.visit('/logout');
				cy.visit(`/trees/${treeId}`);

				cy.contains(treeTitle).should('be.visible');
				cy.contains(userName).should('be.visible');
			});
		});

		it('should display SEO metadata on public tree pages', () => {
			const treeTitle = `SEO Tree ${timestamp}`;
			cy.createTree(treeTitle, 'christmas', 'SEO description test');

			cy.url().then(url => {
				const treeId = url.match(/trees\/([\w-]+)/)?.[1];
				cy.visit(`/trees/${treeId}`);

				// Check meta tags
				cy.document().then(doc => {
					const title = doc.title;
					expect(title).to.include(treeTitle);
					expect(title).to.include(userName);

					const description = doc.querySelector('meta[name="description"]');
					expect(description).to.exist;
					expect(description?.getAttribute('content')).to.include('festive');

					const ogImage = doc.querySelector('meta[property="og:image"]');
					expect(ogImage).to.exist;
					expect(ogImage?.getAttribute('content')).to.include('/images/og-default.png');
				});
			});
		});
	});

	describe('Tree Deletion', () => {
		it('should delete tree successfully', () => {
			const treeTitle = `Deletable Tree ${timestamp}`;
			cy.createTree(treeTitle, 'christmas');

			// Click delete button
			cy.get('button')
				.contains(/delete/i)
				.click();

			// Confirm deletion if there's a modal
			cy.get('body').then($body => {
				if ($body.text().match(/confirm|are you sure/i)) {
					cy.contains('button', /delete|confirm/i).click();
				}
			});

			// Verify redirect to dashboard
			cy.url().should('include', '/dashboard');

			// Verify tree no longer in list
			cy.contains(treeTitle).should('not.exist');
		});

		it('should show deleted tree as not found', () => {
			const treeTitle = `Deleted Tree ${timestamp}`;
			cy.createTree(treeTitle, 'christmas');

			let treeId: string;
			cy.url().then(url => {
				treeId = url.match(/trees\/([\w-]+)/)?.[1] || '';
			});

			// Delete the tree
			cy.get('button')
				.contains(/delete/i)
				.click();
			cy.get('button')
				.contains(/confirm|delete/i)
				.then($btn => {
					if ($btn.length > 0) {
						cy.wrap($btn).click();
					}
				});

			cy.wait(1000);

			// Try to access deleted tree
			cy.visit(`/trees/${treeId}`, { failOnStatusCode: false });

			cy.contains(/not found|doesn't exist/i).should('be.visible');
		});
	});

	describe('Tree Themes', () => {
		const themes = ['christmas', 'birthday', 'valentine', 'easter', 'halloween'];

		themes.forEach(theme => {
			it(`should create ${theme} themed tree`, () => {
				cy.visit('/dashboard/trees/new');

				const treeTitle = `${theme} Tree ${timestamp}`;
				cy.get('input[name="title"]').type(treeTitle);
				cy.get('select[name="theme"]').select(theme);

				cy.get('button[type="submit"]')
					.contains(/create/i)
					.click();

				cy.url().should('match', /\/trees\/[\w-]+/);
				cy.contains(treeTitle).should('be.visible');

				// Verify theme styling applied
				cy.get('[data-testid="tree-canvas"], [class*="tree"]').should('be.visible');
			});
		});
	});
});
