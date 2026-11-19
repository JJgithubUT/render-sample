// Pruebas unitarias. Se ejecutan en GitHub Actions y también en el build de Render.
// Si una falla, Render NO despliega y la versión anterior sigue en línea.
const test = require('node:test');
const assert = require('node:assert');
const { saludar, sumar, formatearUptime } = require('../src/funciones');

test('saludar con nombre', () => {
  assert.match(saludar('Ana'), /Hola, Ana/);
});

test('saludar sin nombre', () => {
  assert.match(saludar(''), /Hola, mundo/);
});

test('sumar dos números', () => {
  // FALLA A PROPÓSITO para la demo: 2 + 3 es 5, no 6.
  // Para arreglarlo, cambia el 6 por 5 y haz push.
  assert.strictEqual(sumar(2, 3), 6);
});

test('sumar acepta texto numérico (query string)', () => {
  assert.strictEqual(sumar('10', '5'), 15);
});

test('sumar rechaza valores no numéricos', () => {
  assert.throws(() => sumar('a', 1));
});

test('formatear uptime', () => {
  assert.strictEqual(formatearUptime(3725), '1h 2m 5s');
});
