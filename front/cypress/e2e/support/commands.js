Cypress.Commands.add('loginAdmin', () =>{
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
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

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
})

Cypress.Commands.add('loginUser', () =>{
  cy.visit('/login')

  cy.intercept('POST', '/api/auth/login', {
    body: {
      id: 1,
      username: 'userName',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: false
    },
  })

  cy.intercept(
    {
      method: 'GET',
      url: '/api/session',
    },
    []).as('session')

  cy.get('input[formControlName=email]').type("toto@gmail.com")
  cy.get('input[formControlName=password]').type(`${"test123!"}{enter}{enter}`)

  cy.url().should('include', '/sessions')
})