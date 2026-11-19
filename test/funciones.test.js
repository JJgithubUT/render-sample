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
  assert.strictEqual(sumar(2, 3), 5);
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
