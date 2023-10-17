import '../support/commands.ts'

describe('Login Logout spec', () => {

  it('should not login successfully (email not found in database)', () => {
    cy.visit('/login')
    // Mock de l'appel à l'appel à login avec retour 401
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        error: 'Bad credentials',
      },
    })

    cy.get('input[formControlName=email]').type("notfound@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.contains('An error occurred').should('be.visible');
  });


  it('should login successfully', () => {
    cy.loginAdmin()
  })

  it('should logout successfully', () => {
    cy.contains('Logout').click()
    cy.url().should('include', '')
  })
});