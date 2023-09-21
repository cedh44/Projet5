import './support/commands'

describe('Register spec', () => {
  it('should register successfully and then login successfully', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

      cy.get('input[formControlName=firstName]').type("toto")
      cy.get('input[formControlName=lastName]').type("titi")
      cy.get('input[formControlName=email]').type("toto@gmail.com")
      cy.get('input[formControlName=password]').type(`${"test123!"}{enter}{enter}`)

    cy.url().should('include', '/login')

    cy.loginUser()
  })
});