# PokerLab — Suite Web de Estudio para Spin & Go

**PokerLab** es una aplicación web *client-side* que unifica en un único espacio de trabajo las tres herramientas esenciales para el estudio técnico de Texas Hold'em en formato **Spin & Go (3-max)**: análisis de impacto contra board (estilo *Flopzilla*), cálculo de equity (estilo *Equilab*) y consulta de estrategias precalculadas (estilo *GTO Wizard*).

Proyecto desarrollado como Trabajo de Fin de Ciclo del **Técnico Superior en Desarrollo de Aplicaciones Web (DAW)**.

---

## El problema que resuelve

Durante el estudio postflop, los jugadores suelen trabajar con tres aplicaciones de escritorio independientes, viéndose obligados a replicar manualmente rangos y boards de un software a otro. **PokerLab** centraliza este flujo en el navegador compartiendo estado en tiempo real entre módulos mediante programación reactiva.

---

## Módulos principales

1. **Análisis de Rangos vs. Flop (Flopzilla):**
   - Matriz interactiva **13×13** con selección por clic/arrastre, pesos mixtos (0%–100%) y carga rápida de rangos preflop por posición (`BTN`, `SB`, `BB`) y profundidad de stack (`25bb` a `10bb`).
   - Cálculo automático de combinaciones descontando cartas bloqueadas por el board[cite: 1].
   - Desglose de impacto por categorías (pares, dobles, tríos, proyectos de color/escalera, aire) en porcentaje y número de combos[cite: 1].
2. **Calculadora de Equity (Equilab):**
   - Cálculo **mano vs. mano** por enumeración exacta[cite: 1].
   - Cálculo **mano/rango vs. rango** mediante simulación **Monte Carlo** ejecutada en **Web Workers** para mantener la interfaz fluida a 60 FPS[cite: 1].
3. **Biblioteca de Soluciones GTO (GTO Wizard):**
   - Consulta de spots postflop precalculados filtrables por posición, stack efectivo y textura de board, con visualización de frecuencias simplificadas[cite: 1].

---

## Arquitectura y Stack Tecnológico

- **Frontend:** Angular (componentes `standalone`, gestión de estado mediante `Signals` y `ChangeDetectionStrategy.OnPush`)[cite: 1].
- **Lenguaje:** TypeScript en modo estricto[cite: 1].
- **Motor de Poker desacoplado (`src/app/engine/`):** Toda la lógica matemática (evaluador de manos, parseo de rangos, combinatoria y simulador Monte Carlo) está escrita en TypeScript puro sin dependencias de Angular ni del DOM, permitiendo su ejecución tanto en tests unitarios como dentro de Web Workers[cite: 1].
- **Persistencia local:** Datasets estructurados en SQLite (`sql.js`) / JSON en `src/assets/data/`[cite: 1, 2].
- **Diseño UI:** Sistema de diseño propio basado en Custom Properties (`tokens.css`), estético y denso en datos, con cumplimiento de accesibilidad **WCAG 2.1 AA**[cite: 1].

---

## Estructura del Repositorio

```text
/
├── AGENTS.md            # Reglas de arquitectura, dominio y convenciones de código[cite: 1]
├── proyecto.md          # Planificación iterativa, tareas e hitos del TFC[cite: 2]
├── docs/                # Documentación técnica, guía de estilo, pruebas y memoria[cite: 1]
└── src/
    ├── styles/          # Variables de diseño (tokens.css) y estilos base[cite: 1]
    ├── assets/data/     # Soluciones GTO precalculadas[cite: 1]
    └── app/
        ├── engine/      # Motor puro de poker (core, ranges, equity, flop, gto)[cite: 1]
        ├── services/    # Servicios de estado compartido y acceso a datos[cite: 1]
        ├── components/  # Componentes reutilizables (matriz 13x13, selector de cartas)[cite: 1]
        ├── pages/       # Vistas principales (rangos-flop, equity, soluciones-gto)[cite: 1]
        └── workers/     # Web Workers para cálculo intensivo en segundo plano[cite: 1]