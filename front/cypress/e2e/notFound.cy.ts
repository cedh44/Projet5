describe('Not Found Spec', () => {
    it('should redirect to the not found page', () => {
      //Redirection vers une page inexistante
        cy.visit('/notexist');
  
      //On s'attend à être redirigé vers /404 et à avoir le message 'Page not found'
      cy.url().should('include', '/404')
      cy.contains('h1','Page not found').should('be.visible');

    });
})