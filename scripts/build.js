// Paso de BUILD: Render lo ejecuta en cada deploy (buildCommand en render.yaml).
// Copia public/ a dist/ y genera dist/build-info.json con los datos del build.
// Render expone variables como RENDER_GIT_COMMIT y RENDER_GIT_BRANCH durante el build.

const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

const raiz = path.join(__dirname, '..');
const origen = path.join(raiz, 'public');
const destino = path.join(raiz, 'dist');

console.log('==> [build] Limpiando dist/ ...');
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });

console.log('==> [build] Copiando archivos estáticos ...');
for (const archivo of fs.readdirSync(origen)) {
  fs.copyFileSync(path.join(origen, archivo), path.join(destino, archivo));
  console.log(`    - ${archivo}`);
}

const info = {
  version: pkg.version,
  commit: (process.env.RENDER_GIT_COMMIT || 'local').slice(0, 7),
  rama: process.env.RENDER_GIT_BRANCH || 'local',
  fechaBuild: new Date().toISOString(),
  entorno: process.env.RENDER ? 'Render' : 'Local',
  node: process.version
};

fs.writeFileSync(path.join(destino, 'build-info.json'), JSON.stringify(info, null, 2));
console.log('==> [build] build-info.json generado:');
console.log(info);
console.log('==> [build] Build terminado correctamente ✔');
