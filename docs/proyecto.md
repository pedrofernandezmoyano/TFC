# proyecto.md

Seguimiento de tareas del TFC (DAW): herramienta web de estudio de poker con análisis de rangos contra flop, calculadora de equity y consulta de soluciones GTO precalculadas.

## Reglas de uso

- Una tarea se marca `[x]` **solo cuando está completamente terminada**: código funcionando, probado, probado en el navegador y con su documentación al día. Si falta algo, sigue `[ ]`.
- Formato: `ID · descripción · duración en días laborables · dependencias`.
- Una tarea no se empieza hasta que sus dependencias estén `[x]` (salvo que se anote la excepción).
- Los hitos `H` se marcan cuando todas las tareas de su bloque están hechas.
- Las fechas son orientativas; si hay desviación, anotarla en `docs/iteraciones.md` (la guía pide explicar diferencias con la planificación inicial).
- Cada iteración entrega los cuatro artefactos de diseño: sketch, wireframe, mockup y prototipo.

## Supuestos de partida (revisar)

- Tecnología: **Angular + TypeScript** (componentes standalone y signals). El motor de poker va en TypeScript puro, independiente de Angular. El autor ha usado Angular un poco en clase, por eso se reserva tiempo de estudio (T0.8).
- Arquitectura: aplicación **solo cliente**. Las soluciones GTO viven en una **base de datos SQLite** (fichero `.db`) que el navegador carga con sql.js, de modo que existe un esquema E-R real para la memoria sin necesidad de servidor. Alternativa si se prefiere simplicidad: JSON estáticos (ver T0.5).
- Planificación: iteraciones con dependencias, para poder dibujar la **red de tareas** que exige la guía.
- Calendario: 17 nov 2026 a 11 jun 2027, entrega en junio (fecha exacta por confirmar).
- Estado inicial: ninguna tarea marcada como hecha. Existe un borrador de Objetivo y Justificación en Word, pero no cuenta como terminado hasta T0.2.

---

## Fase 0 · Propuesta y base (17 nov – 4 dic 2026)

- [ ] **T0.1** · Redactar documento de propuesta (título, resumen, justificación, descripción general, funcionalidades, tecnologías, conclusión) · 5d · —
- [ ] **T0.2** · Redactar Objetivo (general y específicos) y Justificación definitivos · 3d · —
- [ ] **T0.3** · Análisis de competencia: otras herramientas de rangos/equity/GTO y soluciones offline (libros, escuela) · 4d · —
- [ ] **T0.4** · Presentar propuesta a Juanma y recoger feedback · 1d · T0.1
- [ ] **T0.5** · Decidir arquitectura y formato de soluciones (SQLite con sql.js vs JSON) · 2d · T0.4
- [ ] **T0.6** · Planificación temporal: red de tareas (diagrama con tareas e hitos) · 3d · T0.5
- [ ] **T0.7** · Crear repositorio Git, proyecto Angular (`ng new`, TypeScript estricto), estructura de carpetas, README y AGENTS.md · 2d · T0.5
- [ ] **T0.8** · Estudio de Angular: componentes standalone, signals, servicios, `@if`/`@for`, Web Workers y tests; mini-prueba con una matriz de 13x13 · 7d · T0.5

**H0** · Propuesta aprobada, plan cerrado y base de Angular lista · `[ ]`

---

## Iteración 1 · Núcleo de poker y matriz de rangos (7 dic 2026 – 15 ene 2027)

Objetivo: motor básico y selección de rangos funcionando.

- [ ] **T1.1** · Sketch, wireframe, mockup y prototipo de la iteración · 6d · H0
- [ ] **T1.2** · Modelo de cartas, mazo y parser de notación (`As`, `Kd`) en TypeScript puro (`engine/`) · 4d · T0.7
- [ ] **T1.3** · Evaluador de manos de 5-7 cartas con tests · 6d · T1.2
- [ ] **T1.4** · Parser y representación de rangos (`22+, A2s+, KTs+`, pesos 0-1), con conteo de combos · 5d · T1.2
- [ ] **T1.5** · Matriz 13x13 interactiva como componente Angular (selección, pesos, arrastre, `OnPush` y signals) · 6d · T1.1, T1.4, T0.8
- [ ] **T1.6** · Selector de board y cartas con bloqueo de combos · 4d · T1.1, T1.2
- [ ] **T1.7** · Pruebas de la iteración y registro en `docs/pruebas.md` · 2d · T1.3, T1.5, T1.6
- [ ] **T1.8** · Documentar iteración 1 en `docs/iteraciones.md` · 1d · T1.7

**H1** · Núcleo y matriz de rangos terminados · `[ ]`

---

## Iteración 2 · Calculadora de equity (18 ene – 19 feb 2027)

- [ ] **T2.1** · Sketch, wireframe, mockup y prototipo de la iteración · 4d · H1
- [ ] **T2.2** · Equity mano vs mano por enumeración exacta · 4d · T1.3
- [ ] **T2.3** · Equity mano/rango vs rango con Monte Carlo (iteraciones configurables, semilla fija en tests) · 5d · T2.2
- [ ] **T2.4** · Cálculo en Web Worker para no bloquear la interfaz · 3d · T2.3
- [ ] **T2.5** · Interfaz de la calculadora (victoria, empate, equity, barras finas) · 5d · T2.1, T2.4, T1.5
- [ ] **T2.6** · Tests de verificación (AsAh vs KsKh ≈ 82/18; AKs vs QQ ≈ 46/54; empates) · 2d · T2.3
- [ ] **T2.7** · Pruebas de la iteración, registro y documentación · 2d · T2.5, T2.6

**H2** · Calculadora de equity terminada · `[ ]`

---

## Iteración 3 · Análisis de rangos contra flop (22 feb – 26 mar 2027)

- [ ] **T3.1** · Sketch, wireframe, mockup y prototipo de la iteración · 4d · H2
- [ ] **T3.2** · Clasificador de manos contra el flop (par, doble par, trío, color, escalera, nada...) · 6d · T1.3
- [ ] **T3.3** · Detección de proyectos (color, escalera, doble proyecto) · 5d · T3.2
- [ ] **T3.4** · Distribución del rango por categoría (porcentaje y combos) · 4d · T3.2, T3.3, T1.4
- [ ] **T3.5** · Interfaz de análisis: gráfico de barras finas y filtrado de la matriz por categoría · 6d · T3.1, T3.4
- [ ] **T3.6** · Tests, pruebas de la iteración y documentación · 3d · T3.5

**H3** · Análisis contra flop terminado · `[ ]`

---

## Iteración 4 · Soluciones GTO y base de datos (29 mar – 14 may 2027)

Nota: incluye Semana Santa.

- [ ] **T4.1** · Sketch, wireframe, mockup y prototipo de la iteración · 4d · H3
- [ ] **T4.2** · Diseño de la BD: esquema E-R (spots, posiciones, boards, acciones, frecuencias) y tipos de datos · 3d · T0.5
- [ ] **T4.3** · Crear la BD y script de carga con validación (frecuencias de cada combo suman 1) · 5d · T4.2
- [ ] **T4.4** · Reunir/crear 50-100 spots con la fuente anotada (propios, Mentopoker o GTO Wizard), frecuencias simples y un tamaño de apuesta · 15d · T4.2
- [ ] **T4.5** · Carga de la BD en el cliente y capa de consultas · 4d · T4.3
- [ ] **T4.6** · Interfaz de consulta: filtros por posición, stack y board, matriz con frecuencias por acción · 7d · T4.1, T4.5, T1.5
- [ ] **T4.7** · (Opcional) Enviar un spot al análisis de flop como rango · 3d · T4.6, T3.4
- [ ] **T4.8** · Tests, pruebas de la iteración y documentación · 3d · T4.4, T4.6

**H4** · Módulo GTO terminado · `[ ]`

---

## Iteración 5 · Cierre, calidad y despliegue (17 may – 11 jun 2027)

- [ ] **T5.1** · Revisión de accesibilidad (WCAG 2.1 AA, teclado, contraste) · 4d · H4
- [ ] **T5.2** · Validación de HTML/CSS y pulido de la interfaz · 3d · H4
- [ ] **T5.3** · Pruebas finales de extremo a extremo y corrección de fallos · 4d · T5.1, T5.2
- [ ] **T5.4** · Despliegue: requisitos, configuración y creación de la BD · 3d · T5.3
- [ ] **T5.5** · Explicar variaciones respecto a la planificación inicial · 1d · T5.3

**H5** · Aplicación final cerrada · `[ ]`

---

## Memoria y entregables finales

Se avanza en paralelo; cada tarea puede empezar antes si sus dependencias ya están hechas.

- [ ] **D1** · Guía de estilo (paleta, tipografías, botones y navegación, imágenes, otros) · 4d · H3
- [ ] **D2** · Esquema funcional de pantallas · 2d · H4
- [ ] **D3** · Diagramas de estado (matriz, selector de cartas, filtros) · 2d · H4
- [ ] **D4** · Estructuras de datos y modelo E-R para la memoria · 2d · T4.2
- [ ] **D5** · Apartado de codificación (lenguajes, herramientas, librerías con URL, aspectos destacables, estándares y accesibilidad) · 3d · H4
- [ ] **D6** · Apartado de evaluación y pruebas consolidado · 2d · T5.3
- [ ] **D7** · Manual de usuario (descripción y funcionalidades) · 3d · H4
- [ ] **D8** · Vídeo demostrativo con locución de todas las funcionalidades · 3d · T5.4
- [ ] **D9** · Conclusiones · 1d · T5.5
- [ ] **D10** · Maquetar la memoria completa y revisar · 2d · D1-D9

**H6** · Entrega final del TFC · `[ ]`

---

## Pendiente de decidir

- Fecha exacta de entrega en junio.
- Formato final de las soluciones (T0.5): SQLite con sql.js o JSON.
- Librería de tests (Jasmine/Karma o Vitest), según la versión de Angular instalada.
- Si T4.7 entra o se queda fuera.
- Fuente definitiva de los rangos y soluciones (T4.4).
