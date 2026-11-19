// Servidor HTTP sin dependencias externas (solo Node.js).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { saludar, sumar, formatearUptime } = require('./funciones');

const PORT = process.env.PORT || 3000; // Render asigna PORT automáticamente
const DIST = path.join(__dirname, '..', 'dist');
const inicio = Date.now();
let visitas = 0;

function leerBuildInfo() {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIST, 'build-info.json'), 'utf8'));
  } catch {
    return { aviso: 'No hay build. Ejecuta: npm run build' };
  }
}

function json(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

const tipos = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(`${new Date().toISOString()} ${req.method} ${url.pathname}`); // aparece en los Logs de Render

  // Health check: Render lo consulta para saber si el deploy quedó sano
  if (url.pathname === '/health') {
    return json(res, 200, { status: 'ok', uptime: formatearUptime((Date.now() - inicio) / 1000) });
  }

  if (url.pathname === '/api/info') {
    visitas++;
    return json(res, 200, {
      build: leerBuildInfo(),
      servidor: {
        servicio: process.env.RENDER_SERVICE_NAME || 'local',
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        mensaje: process.env.APP_MENSAJE || 'Sin variable APP_MENSAJE',
        uptime: formatearUptime((Date.now() - inicio) / 1000),
        visitas
      }
    });
  }

  if (url.pathname === '/api/saludo') {
    return json(res, 200, { mensaje: saludar(url.searchParams.get('nombre')) });
  }

  if (url.pathname === '/api/sumar') {
    try {
      return json(res, 200, { resultado: sumar(url.searchParams.get('a'), url.searchParams.get('b')) });
    } catch (e) {
      return json(res, 400, { error: e.message });
    }
  }

  // Archivos estáticos generados por el build
  const archivo = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const ruta = path.join(DIST, path.normalize(archivo));
  if (ruta.startsWith(DIST) && fs.existsSync(ruta) && fs.statSync(ruta).isFile()) {
    res.writeHead(200, { 'Content-Type': tipos[path.extname(ruta)] || 'text/plain' });
    return fs.createReadStream(ruta).pipe(res);
  }

  json(res, 404, { error: 'Ruta no encontrada' });
});

server.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
