import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { createStandardMatrix, MatrixCell } from '../../engine/ranges/hand-matrix.model';

@Component({
  selector: 'app-range-matrix',
  standalone: true,
  templateUrl: './range-matrix.html',
  styleUrl: './range-matrix.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangeMatrix {
  /** Mapa de mano -> peso (0 a 1). Ej: { 'AA': 1, 'AKs': 0.5 } */
  readonly weights = input<Record<string, number>>({});

  /** Peso activo que se aplicará al hacer clic o arrastrar (por defecto 1 = 100%) */
  readonly activeWeight = input<number>(1);

  /** Emite el nuevo mapa de pesos cada vez que el usuario modifica la matriz */
  readonly weightsChange = output<Record<string, number>>();

  /** Las 169 celdas estáticas ordenadas de 0 a 168 */
  protected readonly cells: readonly MatrixCell[] = createStandardMatrix();

  /** Estado interno para controlar el pintado por arrastre (drag) */
  private readonly isDragging = signal(false);
  private readonly dragMode = signal<'add' | 'remove'>('add');

  /** Cálculo reactivo del total de combos seleccionados (máximo 1326) */
  protected readonly selectedCombos = computed(() => {
    const currentWeights = this.weights();
    let total = 0;

    for (const cell of this.cells) {
      const w = currentWeights[cell.id] ?? 0;
      if (w > 0) {
        total += cell.combos * w;
      }
    }

    return Math.round(total * 10) / 10;
  });

  /** Porcentaje del total de manos posibles (1326 combos) */
  protected readonly rangePercentage = computed(() => {
    return ((this.selectedCombos() / 1326) * 100).toFixed(1);
  });

  protected getWeight(handId: string): number {
    return this.weights()[handId] ?? 0;
  }

  protected onCellPointerDown(cell: MatrixCell, event: PointerEvent): void {
    event.preventDefault();
    const currentWeight = this.getWeight(cell.id);
    const targetWeight = this.activeWeight();

    // Si ya tiene el mismo peso activo, el arrastre borra; si no, pinta
    const mode = Math.abs(currentWeight - targetWeight) < 0.001 ? 'remove' : 'add';

    this.isDragging.set(true);
    this.dragMode.set(mode);
    this.applyCellChange(cell.id, mode);
  }

  protected onCellPointerEnter(cell: MatrixCell): void {
    if (!this.isDragging()) return;
    this.applyCellChange(cell.id, this.dragMode());
  }

  protected stopDragging(): void {
    if (this.isDragging()) {
      this.isDragging.set(false);
    }
  }

  /** Soporte de teclado (Enter o Espacio) para accesibilidad WCAG 2.1 AA */
  protected onCellKeyDown(cell: MatrixCell, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const currentWeight = this.getWeight(cell.id);
      const mode = currentWeight > 0 ? 'remove' : 'add';
      this.applyCellChange(cell.id, mode);
    }
  }

  private applyCellChange(handId: string, mode: 'add' | 'remove'): void {
    const next = { ...this.weights() };

    if (mode === 'remove' || this.activeWeight() <= 0) {
      delete next[handId];
    } else {
      next[handId] = this.activeWeight();
    }

    this.weightsChange.emit(next);
  }
}