
Cypress.Commands.add('selectUbicacion', (provincia, localidad) => {
  cy.log(`Seleccionando ubicación: ${provincia}, ${localidad}`);
  
  cy.get('[data-cy="select-provincia"]').should('be.visible').type(`${provincia}{enter}`);
  cy.get('[data-cy="select-localidad"]').should('be.visible').type(`${localidad}{enter}`);
});

Cypress.Commands.add('loginAPI', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password });
});