# Trabajo práctico - Automatizacion de Registro de cliente

Este proyecto consiste en la automatización E2E del sitio Ticketazo utilizando **Cypress**

## Escenarios cubiertos:

Se automatizaron los siguientes casos de prueba en `cypress/e2e/register/register.cy.js`:

1.  **Happy Path (Caso Positivo):**
    * Registro exitoso de un nuevo cliente.
    * Generación dinámica de datos (Email, CUIT, Teléfono) para evitar conflictos.
    * Uso de datos base desde `register.ok.json`.
    * Validación de código de estado `201` y redirección de URL.

2.  **Wrong Path (Caso Negativo):**
    * Intento de registro con un email ya existente.
    * uso de datos base desde `register.bad.json`
    * **Simulación de Red (Mocking):** Se intercepta la petición y se fuerza una respuesta `409 Conflict` sin depender del backend real.
    * Validación de la respuesta visual de la aplicación ("Something went wrong!").
  


## ▶️ Ejecución de los Tests

Puedes correr las pruebas de dos maneras:

**1. Modo Interactivo (Cypress Runner):**
Abre la interfaz gráfica para ver los tests en tiempo real.
```bash
npx cypress open