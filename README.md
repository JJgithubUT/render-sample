# Demo de Deploy con Render

Ejemplo sencillo de la **fase Deploy** de DevOps: una app Node.js sin dependencias que se construye, se prueba y se despliega sola en [Render](https://render.com) cada vez que se hace `git push`.

## Qué demuestra

| Concepto | Dónde se ve |
|---|---|
| **Build** | `scripts/build.js` genera `dist/` y `build-info.json` (commit, rama, fecha) |
| **Pruebas antes del deploy** | `buildCommand: npm test && npm run build` en `render.yaml` |
| **CI** | `.github/workflows/ci.yml` corre pruebas y build en GitHub Actions |
| **Infraestructura como código** | `render.yaml` (Blueprint) |
| **Health check** | Ruta `/health`, configurada en `healthCheckPath` |
| **Variables de entorno** | `APP_MENSAJE`, `PORT`, `RENDER_GIT_COMMIT`… se muestran en la página |
| **Logs** | Cada petición se imprime y se ve en la pestaña *Logs* de Render |

## Rutas de la API

- `GET /` — página con la info del build y del servidor
- `GET /health` — estado del servicio
- `GET /api/info` — datos del build y del servidor
- `GET /api/saludo?nombre=Ana`
- `GET /api/sumar?a=2&b=3`

## Correr en local

```bash
npm test        # pruebas
npm run build   # build
npm start       # http://localhost:3000
```

## Subir a GitHub

```bash
git init
git add .
git commit -m "Demo deploy en Render"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/devops-render-demo.git
git push -u origin main
```

## Desplegar en Render

1. Entra a [dashboard.render.com](https://dashboard.render.com) con tu cuenta de GitHub.
2. **New + → Blueprint** y elige el repositorio.
3. Render lee `render.yaml`, muestra el servicio `devops-render-demo` → **Apply**.
4. Espera el build (en *Events/Logs* se ven los mensajes `==> [build] ...`).
5. Abre la URL `https://devops-render-demo-xxxx.onrender.com`.

> En el plan gratuito el servicio se "duerme" tras ~15 min sin uso; la primera visita tarda unos segundos en despertar.

## Demostraciones para la clase

**1. Deploy automático:** cambia `APP_MENSAJE` en `render.yaml` o el título en `public/index.html`, haz push y recarga la página: cambian el commit y la fecha del build.

**2. Deploy que falla (y no rompe producción):** en `test/funciones.test.js` cambia `assert.strictEqual(sumar(2, 3), 5)` por `6`, haz push. El build falla en GitHub Actions y en Render, y la versión anterior **sigue en línea**. Regresa el `5` y vuelve a hacer push.

**3. CI → CD:** cambia `autoDeployTrigger: commit` por `checksPass` en `render.yaml`. Así Render solo despliega cuando GitHub Actions termina en verde.

**4. Rollback:** en Render → *Events*, elige un deploy anterior y pulsa **Rollback**.
