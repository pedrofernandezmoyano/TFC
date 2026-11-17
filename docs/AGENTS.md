# AGENTS.md

Guía para agentes de IA que trabajen en este repositorio. Léelo entero antes de tocar código.

## 1. Contexto del proyecto

Trabajo de Fin de Ciclo del **Técnico Superior en Desarrollo de Aplicaciones Web (DAW)**, módulo *Proyecto de Desarrollo de Aplicaciones Web*. Entrega prevista: **junio de 2027**. El proyecto no se publica; se despliega en local/entorno de demostración.

**Qué es:** aplicación web de estudio de poker (estilo Flopzilla) con tres módulos:

1. **Análisis de rangos contra flop**: el usuario define un rango (matriz 13x13) y un flop; la app muestra cómo conecta el rango (pares, proyectos de color/escalera, nada, etc.) con porcentajes y combos.
2. **Calculadora de equity**: equity de mano vs. mano y mano/rango vs. rango, con board opcional.
3. **Consulta de soluciones GTO precalculadas**: biblioteca de 50-100 spots guardados, con frecuencias simples (p. ej. 25% bet grande / 75% check), sin multiplicidad de tamaños de apuesta.

Usuario único (uso personal/estudio). Foco: formato **Spin & Go** y spots postflop sencillos.

## 2. Stack

El autor conoce HTML, CSS y JS, y ha usado Angular un poco en clase pero lo está aprendiendo. Explica con claridad el código de Angular y evita funciones avanzadas innecesarias.

- **Frontend:** Angular (última versión estable) con TypeScript en modo estricto, componentes **standalone**, **signals** para el estado y `ChangeDetectionStrategy.OnPush`. CSS propio con variables (sin librerías de UI).
- **Arquitectura:** aplicación **solo cliente**, sin backend.
- **Datos GTO:** base de datos SQLite (`.db`) cargada en el navegador con sql.js, o JSON si se decide así en T0.5. Ficheros en `src/assets/data/`.
- **Cálculo pesado:** Web Workers (equity Monte Carlo).
- **Tests:** Jasmine/Karma o Vitest (el que traiga la versión de Angular instalada).
- **Control de versiones:** Git + GitHub.

Reglas:
- No añadir dependencias nuevas sin justificarlas en el PR/commit y anotarlas en `docs/dependencias.md` (nombre, utilidad, URL). El módulo exige documentarlas.
- Preferir librerías pequeñas o código propio antes que paquetes pesados.

## 3. Estructura del repositorio (propuesta)

```
/
├── AGENTS.md
├── README.md
├── proyecto.md          # tareas y progreso
├── src/
│   ├── styles/          # tokens.css (variables), base.css
│   ├── assets/
│   │   └── data/        # base de datos / JSON de spots GTO
│   └── app/
│       ├── engine/      # TypeScript PURO, sin imports de Angular
│       │   ├── core/    # cartas, mazo, evaluador de manos
│       │   ├── ranges/  # parseo y representación de rangos
│       │   ├── equity/  # enumeración exacta y Monte Carlo
│       │   ├── flop/    # análisis de rango contra flop
│       │   └── gto/     # modelos y validación de soluciones
│       ├── services/    # servicios Angular que envuelven el engine y la BD
│       ├── components/  # matriz 13x13, selector de cartas, paneles
│       ├── pages/       # rangos-flop, equity, soluciones-gto
│       └── workers/     # Web Workers
└── docs/                # documentación del TFC (ver sección 8)
```

Regla clave: **`engine/` no importa nada de Angular ni del DOM.** Así se prueba de forma aislada y la lógica de poker queda independiente de la interfaz.

Ajustar si la estructura real difiere; actualizar este bloque en el mismo cambio.

## 4. Comandos

> Comprobar que coinciden con los scripts de `package.json` una vez creado el proyecto Angular.

```bash
# instalar dependencias
npm install

# servir en local
ng serve

# tests
ng test

# build de producción
ng build
```

Antes de dar una tarea por terminada: ejecutar los tests y abrir la app en el navegador para comprobar que la funcionalidad toca realmente funciona.

## 5. Convenciones de código

- Idioma del **código** (variables, funciones, ficheros): inglés. Idioma de **comentarios, commits, UI y documentación**: español.
- TypeScript estricto: sin `any`, tipos explícitos en las funciones públicas. Funciones pequeñas y puras en `engine/`.
- Angular: componentes standalone, `inject()` para dependencias, estado con signals, plantillas con control flow nativo (`@if`, `@for`). Componentes pequeños: lógica de poker en `engine/`, no en los componentes.
- Nombres de archivo en `kebab-case` (convención de Angular). Clases CSS en `kebab-case` (BEM ligero si hace falta).
- Notación de poker estándar: cartas `As`, `Kd`, `Tc`, `9h`; manos `AKs`, `AKo`, `TT`; rangos `22+, A2s+, KTs+, ATo+`.
- Representación interna recomendada: carta = entero 0-51; mano = par de enteros; rango = mapa combo -> peso (0-1).
- Commits pequeños y descriptivos, estilo `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`.
- Sin código muerto ni `console.log` olvidados.

## 6. Reglas de dominio (poker)

Cualquier cambio en lógica de poker debe respetar esto y venir con tests:

- Una mano concreta son 6 combos para pares, 4 para suited, 12 para offsuit. Quitar combos bloqueados por las cartas del board y de la mano rival.
- Equity: enumeración exacta cuando sea viable (p. ej. flop/turn conocidos); Monte Carlo configurable (por defecto ~10.000-50.000 iteraciones) cuando no. El resultado debe ser reproducible en tests (semilla fija) y converger al valor exacto en casos conocidos.
- Los empates reparten el bote; contarlos como media victoria en equity.
- Casos de verificación mínimos: `AsAh` vs `KsKh` preflop ≈ 82% / 18%; `AKs` vs `QQ` ≈ 46% / 54%; manos idénticas con palos distintos se reparten bien.
- Soluciones GTO: son datos **precalculados**, no se calculan en la app. Cada spot en JSON incluye al menos: formato, posiciones, stacks efectivos, board, línea de acciones previa, y frecuencias por acción para cada mano/combo. Validar que las frecuencias de cada combo sumen 1 (tolerancia 0,001).
- Origen de los rangos y soluciones: propios, de la escuela (Mentopoker) o de GTO Wizard. **No copiar masivamente contenido con licencia restrictiva**; anotar siempre la fuente en el campo `source` del JSON.

## 7. Diseño y UI

Estética **compacta, densa en datos y funcional**. Es una herramienta de estudio, no una landing.

- Sistema de **tres colores** (base neutra, acento, y un color de estado/alerta). Definirlos como variables CSS en `tokens.css`.
- Sin degradados, sin sombras decorativas, sin emojis en la UI, sin aspecto "generado por IA" (nada de tarjetas blandas redondeadas por todas partes ni gradientes morados).
- Iconos en **SVG** inline o sprite, no fuentes de iconos.
- Barras de progreso/frecuencia finas.
- Matriz 13x13 legible: celdas cuadradas, color por frecuencia de acción, tooltip con combos y frecuencia exacta.
- Accesibilidad: contraste mínimo WCAG 2.1 AA, navegación por teclado en la matriz y controles, `aria-label` en iconos, no depender solo del color (añadir texto/porcentaje).
- Responsive: usable en escritorio (prioridad) y móvil.
- Rendimiento: la matriz tiene 169 celdas; usar `OnPush`, signals y `track` en los `@for` para evitar re-renderizados innecesarios.

Mantener la guía de estilo (paleta, tipografías, botones, imágenes) actualizada en `docs/guia-estilo.md`.

## 8. Documentación del TFC

El módulo exige entregar una memoria con estas secciones. Cuando implementes algo relevante, deja material útil en `docs/`:

1. Objetivo (general y específicos) · 2. Justificación · 3. Análisis de la competencia · 4. Propuesta detallada (sketch, wireframe, mockup, prototipo) · 5. Planificación temporal (**red de tareas**; el Gantt solo como extra) y objetivos por iteración · 6. Diseño (esquema funcional, estructuras de datos y modelo E-R si hay BD, diagramas de estado, guía de estilo, vídeo demostrativo con locución) · 7. Codificación (lenguajes, herramientas, librerías con URL, aspectos destacables, estándares y accesibilidad) · 8. Despliegue · 9. Evaluación y pruebas (registro de pruebas, resultados y correcciones) · 10. Manual de usuario · 11. Conclusiones.

Reglas para el agente:
- Desarrollo **iterativo (metodología ágil)**: cada iteración entrega algo funcional. Registrar en `docs/iteraciones.md` fecha de inicio/fin, funcionalidades y desviaciones respecto a la planificación inicial.
- Registrar en `docs/pruebas.md` cada prueba relevante: qué se probó, resultado y corrección aplicada.
- Anotar en `docs/implementacion.md` las soluciones técnicas no triviales (ideal para el apartado "aspectos destacables").
- No inventar resultados de pruebas ni capturas: documentar solo lo que se ha ejecutado de verdad.

## 9. Cómo trabajar

- **Planifica antes de cambios grandes** (varios ficheros o cambio de arquitectura): propón el plan y espera confirmación.
- Cambios pequeños y enfocados; una tarea por commit.
- Si hay ambigüedad en una regla de poker o en un requisito, pregunta en vez de asumir.
- No refactorizar código no relacionado con la tarea.
- No borrar ni sobrescribir `src/assets/data/` ni `docs/` sin pedirlo expresamente.
- Si añades una funcionalidad, añade su test y actualiza la documentación afectada en el mismo cambio.
- Prioriza **soluciones que funcionen y sean simples** sobre abstracciones elegantes. El autor debe poder entender y defender cada línea en la presentación.

## 10. Fuera de alcance

- Solver GTO propio (se usan soluciones precalculadas).
- Multijugador, cuentas de usuario, pagos o publicación en producción.
- Soporte de variantes distintas a Texas Hold'em.
- Más de un tamaño de apuesta por spot en las soluciones guardadas.
