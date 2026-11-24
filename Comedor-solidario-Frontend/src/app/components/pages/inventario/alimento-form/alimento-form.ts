import { Component, effect, input, output, signal } from '@angular/core';
import { form, FormField, min, required, submit } from '@angular/forms/signals';
import { Alimento, AlimentoForm as Datos } from '../../../../models/alimento.model';

@Component({
  selector: 'app-alimento-form',
  imports: [FormField],
  templateUrl: './alimento-form.html',
  styleUrl: './alimento-form.css',
})
export class AlimentoForm {
  inicial = input<Alimento | null>(null);
  errorRemoto = input<string | null>(null);
  guardar = output<Datos>();
  cancelar = output<void>();

  unidades = ['kg', 'botellas (1L)', 'paquetes (1kg)', 'bolsas', 'latas', 'unidades'];

  modelo = signal<Datos>({
    nombre: '',
    cantidad: 0,
    unidad: 'kg',
    fechaIngreso: new Date().toLocaleDateString('en-CA'), // AAAA-MM-DD en hora local
    stockMinimo: 5,
  });

  formulario = form(this.modelo, (campo) => {
    required(campo.nombre, { message: 'Escribe el nombre del alimento' });
    min(campo.cantidad, 0, { message: 'La cantidad no puede ser negativa' });
    min(campo.stockMinimo, 0, { message: 'El stock mínimo no puede ser negativo' });
    required(campo.fechaIngreso, { message: 'Elige la fecha de ingreso' });
  });

  constructor() {
    effect(() => {
      const a = this.inicial();
      if (a) {
        const { id, ...datos } = a;
        this.modelo.set(datos);
      }
    });
  }

  enviar() {
    submit(this.formulario, async () => {
      this.guardar.emit(this.modelo());
    });
  }
}
