import '../support/commands.ts'

describe('Register spec', () => {

  it('should init register form successfully', () => {
    cy.visit('/register');
    cy.get('app-register').should('be.visible');
    cy.get('app-register form').should('be.visible');
    cy.get('app-register form input[formControlName=firstName]').should('be.visible');
    cy.get('app-register form input[formControlName=lastName]').should('be.visible');
    cy.get('app-register form input[formControlName=email]').should('be.visible');
    cy.get('app-register form input[formControlName=password]').should('be.visible');
    cy.get('app-register form button[type="submit"]').should('be.visible');
  })

  it('should register successfully and then login successfully', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
      },
    })

    cy.get('input[formControlName=firstName]').type("toto")
    cy.get('input[formControlName=lastName]').type("titi")
    cy.get('input[formControlName=email]').type("toto@gmail.com")
    cy.get('input[formControlName=password]').type(`${"test123!"}{enter}{enter}`)
    
    //On s'attend à arriver sur la page de login
    cy.url().should('include', '/login')

    cy.loginUser()
  })
});