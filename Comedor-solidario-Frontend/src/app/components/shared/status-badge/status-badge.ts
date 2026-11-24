import { Component, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.html',
})
export class StatusBadge {
  texto = input.required<string>();
  tipo = input<'verde' | 'naranja' | 'rojo'>('verde');
}
