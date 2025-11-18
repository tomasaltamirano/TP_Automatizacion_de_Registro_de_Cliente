const Generador = {
  email: (base) => {
    const timestamp = Date.now();
    return `${base}-${timestamp}@gmail.com`;
  },
  numero: (base, largoTotal) => {
    const largoRestante = largoTotal - base.length;
    const random = Math.floor(Math.random() * Math.pow(10, largoRestante));
    return base + random.toString();
  }
};

describe('TP: Automatización de Registro de Cliente', () => {

  before(() => {
    cy.fixture('register/register.ok.json').as('okData');
    cy.fixture('register/register.bad.json').as('badData');
  });

  beforeEach(() => {
    cy.visit('/auth/registerClient');
  });

  // --- CASO 1: HAPPY PATH ---
  it.skip('Caso Positivo: Registro Exitoso de Cliente (Happy Path)', function () {
    const emailRandom = Generador.email(this.okData.emailBase);
    const cuitRandom = Generador.numero(this.okData.cuitBase, 11); // CUIT 11 dígitos
    const telRandom = Generador.numero(this.okData.telefonoBase, 10); // Tel 10 dígitos

    cy.intercept('POST', '**/register-client').as('requestRegistro');

    cy.get('[data-cy="input-razon-social"]').type(this.okData.razonSocial);
    cy.get('[data-cy="input-cuit"]').type(cuitRandom);
    
    cy.selectUbicacion(this.okData.provincia, this.okData.localidad);

    cy.get('[data-cy="input-direccion"]').type(this.okData.direccion);
    cy.get('[data-cy="input-telefono"]').type(telRandom);

    cy.get('[data-cy="input-email"]').type(emailRandom);
    cy.get('[data-cy="input-confirmar-email"]').type(emailRandom);
    cy.get('[data-cy="input-password"]').type(this.okData.password);
    cy.get('[data-cy="input-repetir-password"]').type(this.okData.password);

    cy.get('input[type="checkbox"]').check({force: true}); 

    cy.contains('button', 'Registrarse').click();

    cy.wait('@requestRegistro').its('response.statusCode').should('eq', 201);

    cy.url().should('not.include', '/registerClient');
  });

  // --- CASO 2: WRONG PATH  ---
  it('Caso Negativo: Email ya existente (Sin depender del Backend)', function () {
    cy.intercept('POST', '**/register-client', {
      statusCode: 409,
      body: { 
        error: 'Ya existe un usuario registrado con ese correo electrónico',
        message: 'Ya existe un usuario registrado con ese correo electrónico' 
      },
      delay: 500 
    }).as('registroFallido');

    cy.get('[data-cy="input-razon-social"]').type(this.badData.razonSocial);
    cy.get('[data-cy="input-cuit"]').type('20111111112'); 
    cy.selectUbicacion(this.badData.provincia, this.badData.localidad);
    cy.get('[data-cy="input-direccion"]').type(this.badData.direccion);
    cy.get('[data-cy="input-telefono"]').type('3511111111');

    
    cy.get('[data-cy="input-email"]').type(this.badData.emailExistente);
    cy.get('[data-cy="input-confirmar-email"]').type(this.badData.emailExistente);
    cy.get('[data-cy="input-password"]').type(this.badData.password);
    cy.get('[data-cy="input-repetir-password"]').type(this.badData.password);

    cy.contains('button', 'Registrarse').click();
    cy.wait('@registroFallido');

    cy.contains('Something went wrong!').should('be.visible');
    
    cy.url().should('include', '/registerClient');
  });

});
