import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RangeMatrix } from '../../components/range-matrix/range-matrix';

@Component({
  selector: 'app-rangos-flop',
  standalone: true,
  imports: [RangeMatrix],
  templateUrl: './rangos-flop.html',
  styleUrl: './rangos-flop.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangosFlop {
  protected readonly selectedWeights = signal<Record<string, number>>({
    AA: 1,
    KK: 1,
    QQ: 1,
    AKs: 1,
    AKo: 0.5
  });

  protected readonly activeWeight = signal<number>(1);

  protected setWeightPreset(value: number): void {
    this.activeWeight.set(value);
  }

  protected clearRange(): void {
    this.selectedWeights.set({});
  }
}