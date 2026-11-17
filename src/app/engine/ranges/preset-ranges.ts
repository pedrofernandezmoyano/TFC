export type SpinPosition = 'BTN' | 'SB' | 'BB';
export type StackDepth = 25 | 22 | 18 | 15 | 10;

export interface PresetRange {
  readonly position: SpinPosition;
  readonly stack: StackDepth;
  readonly label: string;
  readonly rangeText: string;
  readonly source: string;
}

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

/**
 * Convierte notación estándar de poker (ej: "22+, A2s+, KTo+, AKs:0.5")
 * en el mapa de pesos { handId: weight } que consume la matriz 13x13.
 */
export function parseRangeNotation(notation: string): Record<string, number> {
  const weights: Record<string, number> = {};
  const tokens = notation
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  for (const token of tokens) {
    const [handPart, weightPart] = token.split(':');
    const weight = weightPart ? Math.min(1, Math.max(0, Number(weightPart))) : 1;
    if (Number.isNaN(weight) || weight <= 0) continue;

    for (const handId of expandToken(handPart.trim())) {
      weights[handId] = weight;
    }
  }

  return weights;
}

function expandToken(token: string): string[] {
  const isPlus = token.endsWith('+');
  const base = isPlus ? token.slice(0, -1) : token;

  // 1. Parejas (ej: "TT" o "22+")
  if (base.length === 2 && base[0] === base[1]) {
    const startIdx = RANKS.indexOf(base[0] as (typeof RANKS)[number]);
    if (startIdx === -1) return [];
    if (!isPlus) return [base];

    const result: string[] = [];
    for (let i = startIdx; i >= 0; i--) {
      result.push(`${RANKS[i]}${RANKS[i]}`);
    }
    return result;
  }

  // 2. Suited u Offsuit (ej: "AKs", "A2s+", "KTo+")
  if (base.length === 3 && (base[2] === 's' || base[2] === 'o')) {
    const highIdx = RANKS.indexOf(base[0] as (typeof RANKS)[number]);
    const lowIdx = RANKS.indexOf(base[1] as (typeof RANKS)[number]);
    const suffix = base[2];

    if (highIdx === -1 || lowIdx === -1 || highIdx >= lowIdx) return [];
    if (!isPlus) return [base];

    const result: string[] = [];
    for (let i = lowIdx; i > highIdx; i--) {
      result.push(`${RANKS[highIdx]}${RANKS[i]}${suffix}`);
    }
    return result;
  }

  return [];
}

/**
 * Rangos base de estudio para Spin & Go por posición y profundidad de stack.
 */
export const SPIN_PRESET_RANGES: readonly PresetRange[] = [
  // BTN (Open Raise)
  {
    position: 'BTN',
    stack: 25,
    label: 'BTN OR 25bb',
    rangeText: '22+, A2s+, K2s+, Q5s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, 54s, A4o+, K8o+, Q9o+, J9o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BTN',
    stack: 22,
    label: 'BTN OR 22bb',
    rangeText: '22+, A2s+, K2s+, Q5s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, A4o+, K8o+, Q9o+, J9o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BTN',
    stack: 18,
    label: 'BTN OR 18bb',
    rangeText: '22+, A2s+, K3s+, Q6s+, J7s+, T7s+, 97s+, 86s+, 76s, A5o+, K9o+, Q9o+, JTo',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BTN',
    stack: 15,
    label: 'BTN OR/Push 15bb',
    rangeText: '22+, A2s+, K4s+, Q7s+, J7s+, T7s+, 97s+, 87s, A5o+, K9o+, QTo+, JTo',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BTN',
    stack: 10,
    label: 'BTN Push/MR 10bb',
    rangeText: '22+, A2s+, K5s+, Q8s+, J8s+, T8s+, 98s, A3o+, K9o+, QTo+, JTo',
    source: 'GTO Spin & Go Baseline'
  },

  // SB (Open Raise / Limp-Isolate)
  {
    position: 'SB',
    stack: 25,
    label: 'SB OR/Limp 25bb',
    rangeText: '22+, A2s+, K2s+, Q2s+, J4s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, A2o+, K5o+, Q7o+, J8o+, T8o+, 98o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'SB',
    stack: 22,
    label: 'SB OR/Limp 22bb',
    rangeText: '22+, A2s+, K2s+, Q3s+, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, A2o+, K5o+, Q8o+, J8o+, T8o+, 98o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'SB',
    stack: 18,
    label: 'SB OR/Limp 18bb',
    rangeText: '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, A2o+, K6o+, Q8o+, J8o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'SB',
    stack: 15,
    label: 'SB Push/Limp 15bb',
    rangeText: '22+, A2s+, K2s+, Q5s+, J6s+, T7s+, 97s+, 86s+, 76s, A2o+, K6o+, Q8o+, J9o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'SB',
    stack: 10,
    label: 'SB Push/Limp 10bb',
    rangeText: '22+, A2s+, K3s+, Q6s+, J7s+, T7s+, 97s+, 87s, A2o+, K5o+, Q8o+, J9o+',
    source: 'GTO Spin & Go Baseline'
  },

  // BB (Defend vs BTN OR)
  {
    position: 'BB',
    stack: 25,
    label: 'BB Defend 25bb',
    rangeText: '22+, A2s+, K2s+, Q2s+, J4s+, T6s+, 96s+, 85s+, 75s+, 64s+, 53s+, 43s, A2o+, K6o+, Q8o+, J8o+, T8o+, 98o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BB',
    stack: 22,
    label: 'BB Defend 22bb',
    rangeText: '22+, A2s+, K2s+, Q3s+, J5s+, T6s+, 96s+, 85s+, 75s+, 64s+, 54s, A2o+, K7o+, Q8o+, J8o+, T8o+, 98o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BB',
    stack: 18,
    label: 'BB Defend 18bb',
    rangeText: '22+, A2s+, K2s+, Q4s+, J6s+, T6s+, 96s+, 86s+, 75s+, 65s, A2o+, K7o+, Q9o+, J9o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BB',
    stack: 15,
    label: 'BB Defend 15bb',
    rangeText: '22+, A2s+, K3s+, Q5s+, J6s+, T7s+, 97s+, 86s+, 76s, A3o+, K8o+, Q9o+, J9o+, T9o',
    source: 'GTO Spin & Go Baseline'
  },
  {
    position: 'BB',
    stack: 10,
    label: 'BB Defend 10bb',
    rangeText: '22+, A2s+, K4s+, Q6s+, J7s+, T7s+, 97s+, 87s, A4o+, K9o+, QTo+, JTo',
    source: 'GTO Spin & Go Baseline'
  }
];