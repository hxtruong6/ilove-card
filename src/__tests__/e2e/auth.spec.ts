// cypress/e2e/auth.spec.ts
describe('Authentication Flow', () => {
  it('should complete signup and login flow', () => {
    // Test signup
    cy.visit('/signup');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('ValidPass123!');
    cy.get('[data-testid="signup-button"]').click();

    // Verify email (mock)
    cy.visit('/verify-email?token=mock-token');

    // Test login
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('ValidPass123!');
    cy.get('[data-testid="login-button"]').click();

    // Verify redirect to last active tree
    cy.url().should('include', '/trees');
  });
});
