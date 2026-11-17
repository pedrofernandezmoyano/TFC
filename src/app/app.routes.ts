import { Routes } from '@angular/router';
import { RangosFlop } from './pages/rangos-flop/rangos-flop';
import { Equity } from './pages/equity/equity';
import { SolucionesGto } from './pages/soluciones-gto/soluciones-gto';

export const routes: Routes = [
  { path: '', redirectTo: 'rangos-flop', pathMatch: 'full' },
  { path: 'rangos-flop', component: RangosFlop, title: 'Rangos vs Flop | PokerLab' },
  { path: 'equity', component: Equity, title: 'Calculadora Equity | PokerLab' },
  { path: 'soluciones-gto', component: SolucionesGto, title: 'Soluciones GTO | PokerLab' },
  { path: '**', redirectTo: 'rangos-flop' }
];