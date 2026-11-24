import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
})
export class ProgressBar {
  valor = input.required<number>();
  total = input.required<number>();

  porcentaje = computed(() =>
    this.total() > 0 ? Math.min(100, Math.round((this.valor() / this.total()) * 100)) : 0
  );
}
