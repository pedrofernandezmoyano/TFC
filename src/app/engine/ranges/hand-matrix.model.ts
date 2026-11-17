export type HandType = 'pair' | 'suited' | 'offsuit';

export interface MatrixCell {
  readonly id: string;       // Ej: 'AKs', 'QQ', '72o'
  readonly row: number;      // 0..12
  readonly col: number;      // 0..12
  readonly type: HandType;
  readonly combos: number;   // 6 para pares, 4 para suited, 12 para offsuit
}

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'] as const;

/**
 * Genera las 169 celdas estándar de una matriz de rangos de Texas Hold'em.
 */
export function createStandardMatrix(): readonly MatrixCell[] {
  const cells: MatrixCell[] = [];

  for (let row = 0; row < RANKS.length; row++) {
    for (let col = 0; col < RANKS.length; col++) {
      if (row === col) {
        cells.push({
          id: `${RANKS[row]}${RANKS[col]}`,
          row,
          col,
          type: 'pair',
          combos: 6
        });
      } else if (row < col) {
        // Por encima de la diagonal: suited
        cells.push({
          id: `${RANKS[row]}${RANKS[col]}s`,
          row,
          col,
          type: 'suited',
          combos: 4
        });
      } else {
        // Por debajo de la diagonal: offsuit
        cells.push({
          id: `${RANKS[col]}${RANKS[row]}o`,
          row,
          col,
          type: 'offsuit',
          combos: 12
        });
      }
    }
  }

  return cells;
}