import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-estado-panel',
  templateUrl: './estado-panel.html',
  styleUrl: './estado-panel.css',
})
export class EstadoPanel {
  cargando = input(false);
  error = input<string | null>(null);
  reintentar = output<void>();
}
