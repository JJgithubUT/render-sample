// Funciones de negocio sencillas (lo que "hace" la app).
// Están separadas del servidor para poder probarlas con node --test.

function saludar(nombre) {
  const limpio = String(nombre || '').trim();
  return limpio ? `Hola, ${limpio}. Esta respuesta viene desde Render.` : 'Hola, mundo. Esta respuesta viene desde Render.';
}

function sumar(a, b) {
  const x = Number(a);
  const y = Number(b);
  if (Number.isNaN(x) || Number.isNaN(y)) {
    throw new Error('Los parámetros a y b deben ser números');
  }
  return x + y;
}

function formatearUptime(segundos) {
  const s = Math.floor(segundos);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return `${h}h ${m}m ${r}s`;
}

module.exports = { saludar, sumar, formatearUptime };
