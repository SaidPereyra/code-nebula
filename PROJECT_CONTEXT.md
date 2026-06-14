# PROJECT_CONTEXT — Code Nebula v1

## 1. Visión general

Code Nebula es una experiencia web interactiva tipo videojuego/landing visual que convierte un perfil público de GitHub en una galaxia viva.

El objetivo no es crear un videojuego grande, ni una plataforma social, ni una app compleja con cuentas. La v1 debe ser una experiencia corta, visualmente muy atractiva, terminable en aproximadamente una semana, desplegable en Vercel y suficientemente llamativa para funcionar como proyecto de portafolio.

La experiencia principal será:

1. El usuario entra a una landing espacial premium.
2. Escribe un username de GitHub.
3. La pantalla hace una transición tipo warp/nebulosa.
4. Se genera una galaxia/sistema solar basado en sus repositorios.
5. El perfil del usuario se representa como una estrella central.
6. Los repositorios se representan como planetas orbitando.
7. Cada planeta cambia visualmente según lenguaje, actividad, stars y fecha de actualización.
8. Una mascota virtual llamada Nebbi acompaña la exploración, escanea planetas y muestra mensajes contextuales.
9. El usuario puede hacer hover/click sobre planetas para ver datos del repositorio.
10. Al final puede generar un widget SVG para pegarlo en su README de GitHub.

La v1 debe sentirse como un juego, pero técnicamente debe ser una landing interactiva con escena 3D y microinteracciones.

---

## 2. Nombre del proyecto

Nombre principal:

Code Nebula

Subtítulo:

Explore your GitHub as a living code galaxy.

Frase corta:

Turn your GitHub into a living code galaxy.

Alternativas de copy:

* Your code, visualized as a cosmic system.
* Explore your repos as planets.
* Generate a living GitHub galaxy and share it in your README.
* A playful, visual GitHub profile explorer.

---

## 3. Objetivo de producto v1

Crear una web pública donde cualquier persona pueda escribir un usuario de GitHub y obtener una galaxia visual e interactiva basada en sus repositorios públicos.

La v1 debe priorizar:

1. Impacto visual.
2. Experiencia interactiva simple.
3. Código limpio y mantenible.
4. Deploy sencillo.
5. Widget README funcional.
6. No depender de assets externos complejos.
7. No requerir base de datos.
8. No requerir backend separado.
9. No requerir login.
10. No crecer fuera de alcance.

---

## 4. Alcance cerrado de v1

La v1 incluye:

* Landing page visual.
* Input para username de GitHub.
* Validación básica del username.
* Fetch de datos públicos de GitHub.
* Escena 3D con React Three Fiber.
* Fondo espacial procedural.
* Sistema solar generado desde repositorios.
* Estrella central del usuario.
* Planetas para los repositorios principales.
* Órbitas animadas.
* Hover/click en planetas.
* Panel lateral con datos del repositorio.
* Mascota procedural llamada Nebbi.
* Mensajes contextuales de la mascota.
* Medidor simple de “stardust” o energía.
* Vista/resumen de galaxia.
* Endpoint para generar widget SVG.
* Vista de preview del widget.
* Snippet Markdown para copiar.
* Deploy en Vercel.
* README técnico y visual.

La v1 NO incluye:

* Login con GitHub.
* OAuth.
* Base de datos.
* Neon.
* Render.
* Multijugador.
* WebSockets.
* Comunidad real.
* Leaderboards.
* Sistema de cuentas.
* Guardado persistente de galaxias.
* Personalización avanzada de mascota.
* Editor visual.
* Inventario.
* Misiones largas.
* Física compleja.
* Modelos 3D externos.
* Assets externos obligatorios.
* IA dentro de la app.
* Panel admin.
* Monetización.
* PWA.
* Mobile app.

---

## 5. Stack técnico v1

Stack recomendado:

* Next.js
* React
* TypeScript
* Tailwind CSS
* React Three Fiber
* Drei
* Zustand
* Framer Motion opcional
* Vercel

APIs/endpoints internos:

* `GET /api/github/[username]`
* `GET /api/widget/[username]`

No usar backend separado en v1.

No usar Render en v1.

No usar Neon en v1.

No usar Redis en v1.

Para caché inicial se puede usar:

* Cache-Control en Route Handlers.
* Revalidación simple.
* Caché en memoria opcional solo si no complica.
* Fetch server-side con token de GitHub en variable de entorno.

Variables de entorno sugeridas:

```env
GITHUB_TOKEN=
NEXT_PUBLIC_APP_URL=
```

El token de GitHub solo debe usarse del lado servidor. Nunca debe exponerse al cliente.

---

## 6. Arquitectura de carpetas sugerida

```txt
code-nebula/
  app/
    page.tsx
    u/
      [username]/
        page.tsx
    api/
      github/
        [username]/
          route.ts
      widget/
        [username]/
          route.ts
    globals.css

  src/
    components/
      layout/
        AppShell.tsx
        Header.tsx
        Footer.tsx

      landing/
        HeroSection.tsx
        UsernameSearch.tsx
        FeatureCards.tsx

      nebula/
        NebulaCanvas.tsx
        GalaxyScene.tsx
        StarField.tsx
        UserStar.tsx
        RepoPlanet.tsx
        OrbitRing.tsx
        NebbiCompanion.tsx
        CameraRig.tsx
        GalaxyEffects.tsx

      ui/
        GlassPanel.tsx
        RepoPanel.tsx
        WidgetPreview.tsx
        CopyButton.tsx
        LoadingWarp.tsx
        ErrorState.tsx

    lib/
      github/
        github.client.ts
        github.mapper.ts
        github.types.ts

      nebula/
        languageTheme.ts
        galaxyMath.ts
        repoScoring.ts
        companionMessages.ts

      widget/
        widgetSvg.ts
        widgetTheme.ts

      utils/
        cn.ts
        format.ts
        dates.ts

    store/
      nebula.store.ts

    styles/
      tokens.ts
```

---

## 7. Modelo de datos interno

### GitHubUser

```ts
export type GitHubUser = {
  login: string
  name: string | null
  avatarUrl: string
  htmlUrl: string
  publicRepos: number
  followers: number
  following: number
}
```

### GitHubRepo

```ts
export type GitHubRepo = {
  id: number
  name: string
  fullName: string
  description: string | null
  htmlUrl: string
  language: string | null
  stars: number
  forks: number
  openIssues: number
  updatedAt: string
  pushedAt: string | null
  isFork: boolean
}
```

### NebulaProfile

```ts
export type NebulaProfile = {
  user: GitHubUser
  repos: NebulaRepo[]
  summary: NebulaSummary
}
```

### NebulaRepo

```ts
export type NebulaRepo = {
  id: number
  name: string
  description: string | null
  url: string
  language: string
  stars: number
  forks: number
  updatedAt: string
  sizeScore: number
  activityScore: number
  energyScore: number
  orbitRadius: number
  orbitSpeed: number
  planetRadius: number
  theme: LanguageTheme
}
```

### NebulaSummary

```ts
export type NebulaSummary = {
  username: string
  totalStars: number
  totalForks: number
  topLanguage: string
  activeRepos: number
  dominantEnergy: 'dormant' | 'stable' | 'active' | 'supernova'
}
```

---

## 8. Reglas de mapeo GitHub → galaxia

### Usuario

El usuario de GitHub representa la estrella central.

Reglas visuales:

* Más repos públicos = estrella más grande.
* Más followers = aura más amplia.
* Más actividad reciente = pulso más rápido.
* Avatar puede mostrarse en UI HTML, no necesariamente en la esfera 3D.

### Repositorios

Cada repositorio representa un planeta.

Seleccionar máximo 6 repos en v1.

Criterio de selección:

1. Repos no fork primero.
2. Repos con actividad reciente.
3. Repos con más stars.
4. Repos con lenguaje definido.
5. Repos con descripción.

Orden sugerido:

```txt
score = stars * 3 + forks * 2 + recentActivityScore + hasDescriptionBonus
```

### Tamaño del planeta

```txt
planetRadius = base + normalized(stars + forks + activity)
```

El tamaño debe mantenerse visualmente controlado para que no rompa la escena.

### Velocidad orbital

```txt
orbitSpeed = baseSpeed + activityScore
```

Repos más activos orbitan ligeramente más rápido.

### Brillo del planeta

```txt
brightness = activityScore + starsScore
```

Repos activos o populares deben verse más vivos.

### Lunas

En v1 las lunas son opcionales.

Si se implementan:

* Stars pueden generar pequeñas lunas.
* Forks pueden generar satélites artificiales.
* Issues pueden generar asteroides.

Pero no deben ser obligatorias para terminar la v1.

---

## 9. Temas visuales por lenguaje

Crear un archivo `languageTheme.ts`.

Ejemplos:

```ts
export const languageThemes = {
  TypeScript: {
    primary: '#38bdf8',
    secondary: '#1d4ed8',
    emissive: '#0ea5e9',
    label: 'TypeScript Ocean'
  },
  JavaScript: {
    primary: '#facc15',
    secondary: '#a16207',
    emissive: '#f59e0b',
    label: 'JavaScript Solar'
  },
  Python: {
    primary: '#22c55e',
    secondary: '#14532d',
    emissive: '#84cc16',
    label: 'Python Forest'
  },
  PHP: {
    primary: '#8b5cf6',
    secondary: '#4c1d95',
    emissive: '#a78bfa',
    label: 'PHP Violet Cloud'
  },
  Java: {
    primary: '#f97316',
    secondary: '#7c2d12',
    emissive: '#fb923c',
    label: 'Java Magma'
  },
  C: {
    primary: '#94a3b8',
    secondary: '#334155',
    emissive: '#cbd5e1',
    label: 'C Metal Core'
  },
  'C++': {
    primary: '#60a5fa',
    secondary: '#1e3a8a',
    emissive: '#93c5fd',
    label: 'C++ Blue Forge'
  },
  Rust: {
    primary: '#f97316',
    secondary: '#431407',
    emissive: '#fdba74',
    label: 'Rust Iron Belt'
  },
  default: {
    primary: '#a78bfa',
    secondary: '#312e81',
    emissive: '#c4b5fd',
    label: 'Unknown Nebula'
  }
}
```

No es necesario que sea científicamente correcto. Debe verse bien.

---

## 10. Mascota virtual: Nebbi

Nebbi es una mascota procedural que acompaña al usuario durante la exploración.

Debe construirse con geometrías simples:

* Cuerpo: esfera o cápsula.
* Ojos: pequeñas esferas emisivas.
* Antena: cilindro + esfera pequeña.
* Propulsores: conos o cilindros.
* Aura/glow: material transparente.
* Burbuja de diálogo: HTML overlay.

Personalidad:

* Curiosa.
* Espacial.
* Ligera.
* No invasiva.
* Útil para explicar datos.

No usar IA real en v1.

Los mensajes deben ser condicionales.

Ejemplos:

```ts
export const companionMessages = {
  loading: [
    'Scanning GitHub signals...',
    'Calibrating orbit paths...',
    'Searching for code planets...'
  ],
  noRepos: [
    'I found a quiet sector. This profile has no public planets yet.'
  ],
  activeRepo: [
    'This planet is glowing. Recent activity detected.',
    'Strong commit energy around this orbit.'
  ],
  dormantRepo: [
    'This planet is calm. It has been quiet for a while.',
    'Low activity, but still part of the constellation.'
  ],
  popularRepo: [
    'This one has gravity. Other developers seem to notice it.',
    'High star density detected.'
  ],
  widgetReady: [
    'Your nebula signal is ready to share.',
    'README beacon generated.'
  ]
}
```

Nebbi debe reaccionar a:

* Estado inicial.
* Carga.
* Error.
* Planeta seleccionado.
* Widget generado.

Animaciones mínimas:

* Idle flotante.
* Rotación leve.
* Movimiento hacia planeta seleccionado.
* Parpadeo de ojos.
* Pulso de antena.

---

## 11. Diseño visual

Estilo:

* Dark premium.
* Sci-fi elegante.
* Cyber-nebula.
* Neon controlado.
* No saturar demasiado.
* Inspiración: espacio profundo, dashboards futuristas, sistemas orbitales, terminales premium.

Paleta base:

```txt
Background: #020617
Surface: #07111f
Surface Glass: rgba(15, 23, 42, 0.62)
Border Glass: rgba(148, 163, 184, 0.18)

Cyan: #22d3ee
Blue: #3b82f6
Violet: #8b5cf6
Pink: #ec4899
Emerald: #34d399
Amber: #f59e0b

Text Primary: #e5f0ff
Text Secondary: #94a3b8
Text Muted: #64748b
Danger: #fb7185
```

Tipografía:

* Sans principal: Inter, Geist o similar.
* Mono para datos: JetBrains Mono, Geist Mono o similar.

Efectos visuales:

* Gradientes radiales.
* Blur.
* Glassmorphism.
* Bloom moderado.
* Partículas.
* Líneas orbitales.
* Microinteracciones.
* Transición warp.
* Glow en elementos clave.

Regla visual:

Todo debe verse premium incluso si el proyecto es técnicamente pequeño.

---

## 12. UI principal

### Landing

Debe incluir:

* Header minimal.
* Logo textual: Code Nebula.
* Hero con copy fuerte.
* Input para GitHub username.
* Botón principal: Generate my nebula.
* Botón secundario: View demo.
* Fondo espacial procedural o mini escena.
* Preview visual de sistema solar.

Copy sugerido:

```txt
Turn your GitHub into a living code galaxy.

Explore your public repositories as orbiting planets, scan their activity with Nebbi, and generate a cosmic README widget for your profile.
```

### Galaxy Explorer

Debe incluir:

* Canvas 3D full screen.
* Panel superior con username.
* Panel lateral con repositorio seleccionado.
* Botón para generar widget.
* Botón para volver/cambiar usuario.
* Mascota Nebbi.
* Indicador de stardust/energy.
* Estado de carga y error.

### Widget Generator

Debe incluir:

* Preview del SVG.
* Snippet Markdown.
* Botón copiar.
* Explicación corta.
* Link para abrir perfil generado.

Snippet:

```md
[![Code Nebula](https://code-nebula.vercel.app/api/widget/USERNAME)](https://code-nebula.vercel.app/u/USERNAME)
```

---

## 13. Endpoint GitHub

Ruta:

```txt
GET /api/github/[username]
```

Responsabilidad:

* Validar username.
* Consultar GitHub REST API.
* Obtener datos públicos del usuario.
* Obtener repos públicos.
* Filtrar, ordenar y limitar a 6 repos.
* Mapear a NebulaProfile.
* Retornar JSON limpio.
* Manejar errores esperados.

Errores:

* Username vacío.
* Usuario no encontrado.
* Rate limit.
* GitHub API error.
* Perfil sin repos públicos.
* Error de red.

Respuesta exitosa:

```json
{
  "user": {},
  "repos": [],
  "summary": {}
}
```

Reglas importantes:

* Usar token del servidor si existe.
* Nunca exponer token al frontend.
* Agregar Cache-Control.
* No pedir más datos de los necesarios.
* No hacer muchas llamadas por repo.
* Evitar endpoints costosos.
* Preferir datos de `/users/:username` y `/users/:username/repos`.

---

## 14. Endpoint Widget SVG

Ruta:

```txt
GET /api/widget/[username]
```

Responsabilidad:

* Obtener datos del usuario.
* Generar SVG dinámico.
* Devolver `Content-Type: image/svg+xml`.
* Usar Cache-Control.
* No depender de assets externos.
* No incluir JS.
* No incluir imágenes externas.
* Debe funcionar como imagen embebida en README.

El widget debe ser visual pero simple.

Contenido del widget:

* Fondo espacial.
* Mini planeta o mini sistema solar 2D.
* Username.
* Top language.
* Total stars.
* Active repos.
* Texto “Code Nebula”.
* Pequeño brillo/nebulosa.

Tamaño sugerido:

```txt
800x240
```

Estilo:

* Dark.
* Gradientes SVG.
* Círculos orbitales.
* Planetas simples.
* Texto legible.
* No saturar.

---

## 15. Estados de experiencia

La app debe manejar estos estados:

1. Idle
2. Loading
3. Loaded
4. Planet selected
5. Widget preview
6. Error
7. Empty profile

### Idle

Mensaje de Nebbi:

```txt
Enter a GitHub username and I’ll scan the code sector.
```

### Loading

Mostrar:

* Warp animation.
* Texto de carga.
* Nebbi escaneando.

### Loaded

Mostrar:

* Galaxia.
* Repos como planetas.
* Panel inicial con resumen.

### Planet selected

Mostrar:

* Nebbi se acerca al planeta.
* Panel con datos.
* Mensaje contextual.

### Widget preview

Mostrar:

* SVG.
* Markdown.
* Copy button.
* Mensaje de éxito.

### Error

Mostrar:

* Error amigable.
* Botón intentar de nuevo.
* No romper la UI.

---

## 16. Interactividad mínima obligatoria

La v1 debe tener como mínimo:

* Input de username funcional.
* Transición de loading.
* Escena 3D navegable.
* Planetas orbitando.
* Hover en planeta.
* Click en planeta.
* Panel de información.
* Mascota con estados.
* Botón de widget.
* Copiar Markdown.

Interactividad opcional:

* Stardust al explorar planetas.
* Pequeñas partículas al seleccionar.
* Cámara enfocando planeta.
* Sound effects desactivados por defecto.
* Modo demo con usuario fijo.

---

## 17. Rendimiento

Objetivo:

* Que funcione bien en desktop moderno.
* Que no destruya rendimiento en laptops normales.
* Que tenga fallback visual en móvil o pantallas pequeñas.

Reglas:

* Máximo 6 planetas en v1.
* No cargar modelos externos.
* No usar texturas pesadas.
* Evitar miles de meshes individuales.
* Usar geometrías simples.
* Usar partículas moderadas.
* Limitar post-processing.
* Mantener el Canvas separado de la UI.
* Evitar re-renders innecesarios.
* Memoizar datos mapeados.
* Usar Zustand solo para estado necesario.

Mobile:

* La experiencia puede ser simplificada.
* En móvil, permitir rotar/arrastrar o mostrar vista más estática.
* El objetivo principal es desktop, pero no debe romper en móvil.

---

## 18. Accesibilidad y UX

Aunque sea visual, debe tener:

* Textos legibles.
* Contraste suficiente.
* Loading claro.
* Errores claros.
* Navegación básica por teclado en input/botones.
* Botones con labels.
* Fallback si WebGL falla.
* Respetar `prefers-reduced-motion` cuando sea razonable.

Fallback WebGL:

```txt
Your browser could not start the 3D nebula. You can still generate your README widget.
```

---

## 19. Fases completas de desarrollo v1

## Fase 0 — Setup y documentación inicial

Objetivo:

Crear la base del proyecto, instalar dependencias y definir el documento maestro.

Tareas:

* Crear proyecto Next.js con TypeScript.
* Instalar Tailwind.
* Instalar three, @react-three/fiber y @react-three/drei.
* Instalar Zustand.
* Instalar Framer Motion si se decide usarlo.
* Crear estructura de carpetas.
* Crear `PROJECT_CONTEXT.md`.
* Crear README inicial.
* Crear `.env.example`.
* Verificar `npm run dev`.
* Verificar `npm run build`.

Criterios de terminado:

* Proyecto corre localmente.
* Build pasa.
* Estructura base existe.
* Documento maestro existe.
* README inicial existe.

---

## Fase 1 — Diseño base y landing premium

Objetivo:

Crear la landing visual que explique el proyecto y permita buscar un usuario.

Tareas:

* Crear layout base.
* Crear fondo visual espacial con CSS/Canvas/3D simple.
* Crear Header.
* Crear HeroSection.
* Crear UsernameSearch.
* Crear FeatureCards.
* Crear estilos globales y tokens.
* Crear estados visuales de input.
* Crear botón principal.
* Crear demo visual mock.

Criterios de terminado:

* Landing se ve premium.
* Input existe.
* Botón existe.
* Responsive básico.
* No hay datos reales todavía.
* No hay escena final todavía.

---

## Fase 2 — Escena 3D base

Objetivo:

Crear la base visual de la galaxia con datos mock.

Tareas:

* Crear `NebulaCanvas`.
* Crear `GalaxyScene`.
* Crear `StarField`.
* Crear `UserStar`.
* Crear `RepoPlanet`.
* Crear `OrbitRing`.
* Crear `CameraRig`.
* Crear 5 repos mock.
* Renderizar planetas orbitando.
* Permitir hover/click básico.
* Mostrar panel lateral con datos mock.

Criterios de terminado:

* Hay escena 3D.
* Hay estrella central.
* Hay planetas orbitando.
* Se puede seleccionar planeta.
* El panel lateral cambia con la selección.
* No depende de GitHub todavía.

---

## Fase 3 — Mascota Nebbi

Objetivo:

Crear la mascota procedural e integrarla en la experiencia.

Tareas:

* Crear `NebbiCompanion`.
* Modelar cuerpo con geometrías simples.
* Agregar ojos emisivos.
* Agregar antena.
* Agregar propulsores simples.
* Agregar idle animation.
* Agregar mensajes HTML.
* Crear `companionMessages.ts`.
* Cambiar mensaje según estado.
* Mover Nebbi cerca del planeta seleccionado.

Criterios de terminado:

* Nebbi aparece en escena.
* Tiene animación idle.
* Tiene mensajes.
* Reacciona a loading/idle/planet selected.
* No usa assets externos.

---

## Fase 4 — GitHub API y mapeo real

Objetivo:

Conectar datos reales de GitHub y generar galaxias dinámicas.

Tareas:

* Crear tipos GitHub.
* Crear cliente GitHub server-side.
* Crear mapper GitHub → NebulaProfile.
* Crear endpoint `/api/github/[username]`.
* Validar username.
* Manejar errores.
* Usar token desde env si existe.
* Agregar Cache-Control.
* Conectar frontend con endpoint.
* Reemplazar datos mock por datos reales.
* Crear estado loading/error/empty.
* Mapear lenguaje a tema visual.

Criterios de terminado:

* Buscar un username genera galaxia real.
* Los repos se convierten en planetas.
* Los lenguajes cambian colores.
* Los datos del panel son reales.
* Error 404 se maneja bien.
* Rate limit se maneja con mensaje amigable.

---

## Fase 5 — Interacción tipo juego

Objetivo:

Hacer que la experiencia se sienta más viva sin crear un juego complejo.

Tareas:

* Agregar stardust/energy score.
* Sumar stardust al seleccionar planetas.
* Agregar partículas de selección.
* Agregar cámara que enfoque planeta seleccionado.
* Agregar estado “Galaxy Summary”.
* Agregar mensaje de Nebbi al explorar 3 planetas.
* Agregar botón “Generate README Widget”.
* Agregar microinteracciones con Framer Motion o CSS.

Criterios de terminado:

* La experiencia tiene loop interactivo.
* Seleccionar planetas se siente satisfactorio.
* Hay feedback visual.
* Hay progresión ligera.
* No se agregan sistemas complejos.

---

## Fase 6 — Widget README SVG

Objetivo:

Crear el generador de widget SVG dinámico para GitHub README.

Tareas:

* Crear `widgetSvg.ts`.
* Crear `widgetTheme.ts`.
* Crear endpoint `/api/widget/[username]`.
* Generar SVG con datos reales.
* Agregar `Content-Type: image/svg+xml`.
* Agregar Cache-Control.
* Crear componente `WidgetPreview`.
* Mostrar preview en la app.
* Generar snippet Markdown.
* Crear botón copiar.
* Validar que el SVG renderiza en navegador.
* Validar que no depende de JS ni assets externos.

Criterios de terminado:

* `/api/widget/[username]` devuelve SVG.
* El SVG se ve bien.
* El preview funciona.
* El Markdown se puede copiar.
* El widget se puede usar como imagen.

---

## Fase 7 — Pulido visual y responsive

Objetivo:

Hacer que la app se sienta terminada y presentable.

Tareas:

* Pulir colores.
* Pulir espaciados.
* Pulir tipografía.
* Pulir glass panels.
* Pulir loading warp.
* Pulir errores.
* Ajustar mobile/tablet.
* Agregar reduced motion básico.
* Agregar fallback de WebGL.
* Revisar contraste.
* Revisar textos.
* Revisar comportamiento sin repos.

Criterios de terminado:

* Visual premium.
* No parece prototipo roto.
* Mobile no se rompe.
* Estados vacíos/error se ven bien.
* La experiencia es clara.

---

## Fase 8 — Deploy, README y demo

Objetivo:

Publicar el proyecto y dejarlo listo para portafolio.

Tareas:

* Configurar Vercel.
* Agregar variables de entorno.
* Deploy.
* Probar endpoints en producción.
* Probar usuario real.
* Probar widget en producción.
* Crear README final.
* Agregar capturas/GIF/video si existen.
* Documentar stack.
* Documentar arquitectura.
* Documentar cómo usar el widget.
* Documentar roadmap v2.
* Agregar licencia.
* Agregar badges si aplica.

Criterios de terminado:

* App publicada.
* Build pasa.
* README completo.
* Widget funcional.
* Proyecto listo para compartir.

---

## 20. Roadmap v2, fuera de alcance v1

Después de terminar v1, se puede considerar:

* Login con GitHub.
* Guardar galaxias.
* Base de datos Neon.
* Backend Render si se requiere.
* Redis o Upstash para caché.
* Leaderboard público.
* Galaxias compartibles.
* Más estilos visuales.
* Mascota personalizable.
* Exportar imagen PNG.
* Exportar wallpaper.
* Comparar dos usuarios.
* Organizaciones de GitHub.
* GitHub GraphQL.
* Historial de commits más profundo.
* Widget con más variantes.
* Modo presentación para portafolio.
* Sistema de themes.
* Comunidad.

Nada de esto debe implementarse antes de cerrar v1.

---

## 21. Prompts de trabajo para Antigravity

### Prompt inicial para Antigravity

Trabaja sobre este proyecto llamado Code Nebula.

Objetivo:
Crear una experiencia web interactiva tipo landing/videojuego ligero que convierte un usuario de GitHub en una galaxia visual. La v1 debe ser terminable en aproximadamente una semana, visualmente muy atractiva, desplegable en Vercel y sin backend separado ni base de datos.

Antes de escribir código:

1. Lee completo `PROJECT_CONTEXT.md`.
2. Resume el objetivo de la v1.
3. Propón un plan por fases.
4. No agregues features fuera de alcance.
5. Prioriza visual premium, interactividad simple y código mantenible.

Stack:
Next.js, React, TypeScript, Tailwind, React Three Fiber, Drei, Zustand, Vercel.

Restricciones:

* No login.
* No Neon.
* No Render.
* No multijugador.
* No assets externos obligatorios.
* No IA dentro de la app.
* No crear un juego grande.
* Todo debe ser procedural o creado en código.
* Máximo 6 planetas en la galaxia v1.

Primera tarea:
Implementa Fase 0 y Fase 1 únicamente:

* Setup base.
* Estructura de carpetas.
* Landing premium.
* Input de GitHub username.
* Diseño base.
* README inicial.
* `.env.example`.

No implementes todavía GitHub API ni widget SVG.

Al terminar:

* Da resumen técnico.
* Lista archivos creados/modificados.
* Indica cómo probar.
* Indica riesgos o decisiones pendientes.

### Prompt para continuar fases en Antigravity

Continúa Code Nebula siguiendo `PROJECT_CONTEXT.md`.

Modo:
Implementa solo la fase solicitada. No adelantes features de fases futuras.

Fase solicitada:
[PEGAR FASE AQUÍ]

Reglas:

* Mantén el alcance cerrado.
* No agregues backend externo.
* No agregues base de datos.
* No agregues login.
* No uses assets externos complejos.
* Prioriza diseño visual.
* Mantén componentes pequeños y reutilizables.
* Verifica build.
* Al terminar, reporta archivos creados/modificados, cómo probar y pendientes.

---

## 22. Prompts de trabajo para Codex

### Prompt de auditoría para Codex

Trabaja en modo auditoría sobre Code Nebula.

Antes de modificar código:

1. Lee `PROJECT_CONTEXT.md`.
2. Revisa la implementación actual.
3. Verifica si cumple con el alcance de v1.
4. Detecta inconsistencias.
5. Detecta deuda técnica.
6. Detecta problemas de arquitectura.
7. Detecta problemas de performance en R3F.
8. Detecta problemas de estados/loading/error.
9. Detecta problemas de GitHub API/rate limit.
10. Detecta problemas del widget SVG.
11. Detecta problemas de responsive y UX.

No modifiques código todavía.

Entrega un reporte técnico con:

* Estado general.
* Cumplimiento por fase.
* Problemas críticos.
* Problemas medios.
* Mejoras recomendadas.
* Riesgos antes de deploy.
* Plan de corrección ordenado.

### Prompt de pulido para Codex

Trabaja sobre Code Nebula después de la auditoría.

Objetivo:
Pulir la v1 sin aumentar alcance.

Puedes modificar código para:

* Corregir bugs.
* Mejorar estructura.
* Mejorar performance.
* Mejorar tipos TypeScript.
* Mejorar manejo de errores.
* Mejorar responsive.
* Mejorar widget SVG.
* Mejorar README.
* Mejorar deploy readiness.

No puedes:

* Agregar login.
* Agregar DB.
* Agregar backend externo.
* Agregar multijugador.
* Agregar features v2.
* Reescribir todo sin necesidad.

Al terminar:

* Ejecuta build/lint si están disponibles.
* Resume cambios.
* Lista archivos modificados.
* Explica cómo probar.
* Indica qué queda pendiente para v1.

---

## 23. Definición de terminado v1

Code Nebula v1 se considera terminado cuando:

* La app está desplegada en Vercel.
* El usuario puede buscar un username de GitHub.
* Se genera una galaxia visual real.
* Hay mínimo 3 y máximo 6 planetas cuando el usuario tiene repos suficientes.
* Cada planeta representa un repo.
* Los colores dependen del lenguaje.
* El panel de repo funciona.
* Nebbi aparece y reacciona.
* Existe interacción visual satisfactoria.
* Existe endpoint de widget SVG.
* Existe preview del widget.
* Existe Markdown copiable.
* El README explica el proyecto.
* El build pasa.
* No hay errores obvios de consola en flujo principal.
* La UI no se rompe en móvil.
* No hay features fuera de alcance.
* El proyecto puede mostrarse en portafolio.

---

## 24. Regla principal para evitar scope creep

Cada idea nueva debe pasar este filtro:

¿Mejora el impacto visual o la interacción principal en menos de 2 horas?

Si la respuesta es no, va a roadmap v2.

La v1 no busca ser enorme. Busca ser terminada, visual, memorable y compartible.

---

## 25. Prioridad final

Orden de prioridad:

1. Visual premium.
2. Flujo principal completo.
3. Widget funcional.
4. Código mantenible.
5. Deploy estable.
6. README fuerte.
7. Interacciones extra.

Nunca sacrificar terminar v1 por agregar features de v2.

---

## 26. Resultado esperado

Al terminar v1, el proyecto debe poder presentarse así:

Code Nebula is an interactive GitHub galaxy generator. It turns public repositories into orbiting planets, visualizes language/activity signals in 3D, includes a procedural companion called Nebbi, and generates a dynamic SVG widget for GitHub profile READMEs.

Debe verse como un proyecto de portafolio creativo, técnico y completo, no como una demo incompleta.
