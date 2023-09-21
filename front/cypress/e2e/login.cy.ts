import './support/commands'

describe('Login spec', () => {
  it('Login successfull', () => {
    cy.loginAdmin()
  })
});