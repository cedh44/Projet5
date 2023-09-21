import './support/commands'

describe('Me spec', () => {
  it('should login successfully and display account informations successfully', () => {
    
    cy.intercept({
        method: 'GET',
        url: '/api/session'
    })

    const user = {
        email: 'toto@gmail.com',
        firstName: 'toto',
        lastName: 'titi',
        admin: false,
        createdAt: new Date(2023, 9, 21),
        updatedAt: new Date(2023, 9, 25)
    }
    // Mock du user en retour
    cy.intercept('GET', '/api/user/1', {
        body: {
            email: 'toto@gmail.com',
            firstName: 'toto',
            lastName: 'titi',
            admin: false,
            createdAt: new Date(2023, 9, 21),
            updatedAt: new Date(2023, 9, 25)
        }
    })

    cy.loginUser()

    cy.url().should('include', '/sessions')

    // On s'attend à ce que le bouton Account soit visible
    cy.contains('span.link', 'Account').should('be.visible')

    // Clic sur Account
    cy.contains('span.link', 'Account').click()

    cy.contains('Name: toto TITI').should('be.visible')
    cy.contains('Email: toto@gmail.com').should('be.visible');
    cy.contains('Delete my account:').should('be.visible');
    cy.contains('Create at: October 21, 2023').should('be.visible');
    cy.contains('Last update: October 25, 2023').should('be.visible');

  })
});