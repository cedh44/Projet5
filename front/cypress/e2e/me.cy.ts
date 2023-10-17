import '../support/commands.ts'

describe('Me spec (Register)', () => {
  it('should login successfully and display account informations successfully', () => {

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
    //Login as a user
    cy.loginUser()

    cy.url().should('include', '/sessions')

    // On s'attend à ce que le bouton Account soit visible
    cy.contains('span.link', 'Account').should('be.visible')

    // Clic sur Account
    cy.contains('span.link', 'Account').click()

    //On vérifie que les informations mockées s'affichent correctement
    cy.contains('Name: toto TITI').should('be.visible')
    cy.contains('Email: toto@gmail.com').should('be.visible');
    cy.contains('Delete my account:').should('be.visible');
    cy.contains('Create at: October 21, 2023').should('be.visible');
    cy.contains('Last update: October 25, 2023').should('be.visible');

  })

  it('should delete my account', () => {

        //On mocke l'appel DELETE du user 1 (retour 200 OK attendu)
        cy.intercept('DELETE', 'api/user/1', {
          statusCode: 200,
        })
    
        //Clic sur Delete
        cy.contains('span.ml1', 'Delete').click()
    
        //On s'attend à avoir le message 'Session deleted !'
        cy.contains('Your account has been deleted !').should('be.visible')
        cy.wait(3000)
  })
});