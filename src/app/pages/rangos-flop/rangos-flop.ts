import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RangeMatrix } from '../../components/range-matrix/range-matrix';
import {
  parseRangeNotation,
  SPIN_PRESET_RANGES,
  SpinPosition,
  StackDepth
} from '../../engine/ranges/preset-ranges';

@Component({
  selector: 'app-rangos-flop',
  standalone: true,
  imports: [RangeMatrix],
  templateUrl: './rangos-flop.html',
  styleUrl: './rangos-flop.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RangosFlop {
  protected readonly positions: readonly SpinPosition[] = ['BTN', 'SB', 'BB'];
  protected readonly stacks: readonly StackDepth[] = [25, 22, 18, 15, 10];

  protected readonly selectedPosition = signal<SpinPosition | null>('BTN');
  protected readonly selectedStack = signal<StackDepth | null>(25);
  protected readonly rangeInputText = signal<string>(this.getPresetText('BTN', 25));

  protected readonly selectedWeights = signal<Record<string, number>>(
    parseRangeNotation(this.getPresetText('BTN', 25))
  );

  protected readonly activeWeight = signal<number>(1);

  protected selectPosition(pos: SpinPosition): void {
    this.selectedPosition.set(pos);
    const stack = this.selectedStack() ?? 25;
    this.selectedStack.set(stack);
    this.applyPreset(pos, stack);
  }

  protected selectStack(stack: StackDepth): void {
    this.selectedStack.set(stack);
    const pos = this.selectedPosition() ?? 'BTN';
    this.selectedPosition.set(pos);
    this.applyPreset(pos, stack);
  }

  protected onTextInput(rawText: string): void {
    this.selectedPosition.set(null);
    this.selectedStack.set(null);
    this.rangeInputText.set(rawText);
    this.selectedWeights.set(parseRangeNotation(rawText));
  }

  protected onManualMatrixChange(weights: Record<string, number>): void {
    this.selectedPosition.set(null);
    this.selectedStack.set(null);
    this.selectedWeights.set(weights);
    this.rangeInputText.set(Object.keys(weights).join(', '));
  }

  protected setWeightPreset(value: number): void {
    this.activeWeight.set(value);
  }

  protected clearRange(): void {
    this.selectedPosition.set(null);
    this.selectedStack.set(null);
    this.rangeInputText.set('');
    this.selectedWeights.set({});
  }

  private applyPreset(pos: SpinPosition, stack: StackDepth): void {
    const text = this.getPresetText(pos, stack);
    this.rangeInputText.set(text);
    this.selectedWeights.set(parseRangeNotation(text));
  }

  private getPresetText(pos: SpinPosition, stack: StackDepth): string {
    const found = SPIN_PRESET_RANGES.find(
      (item) => item.position === pos && item.stack === stack
    );
    return found ? found.rangeText : '';
  }
}