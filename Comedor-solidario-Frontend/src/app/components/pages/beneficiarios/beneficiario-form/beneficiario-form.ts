import { Component, effect, input, output, signal } from '@angular/core';
import {
  form,
  FormField,
  max,
  maxLength,
  min,
  pattern,
  required,
  submit,
} from '@angular/forms/signals';
import { Beneficiario, BeneficiarioForm as Datos } from '../../../../models/beneficiario.model';

@Component({
  selector: 'app-beneficiario-form',
  imports: [FormField],
  templateUrl: './beneficiario-form.html',
  styleUrl: './beneficiario-form.css',
})
export class BeneficiarioForm {
  inicial = input<Beneficiario | null>(null);
  errorRemoto = input<string | null>(null);
  guardar = output<Datos>();
  cancelar = output<void>();

  categorias = [
    'Grupo Familiar',
    'Atención Prioritaria',
    'Beneficiario Regular',
    'Apoyo Nutricional Escolar',
  ];

  modelo = signal<Datos>({
    nombre: '',
    categoria: 'Beneficiario Regular',
    dni: '',
    edad: 0,
    telefono: '',
    raciones: 1,
  });

  formulario = form(this.modelo, (campo) => {
    required(campo.nombre, { message: 'Escribe el nombre' });
    required(campo.dni, { message: 'Escribe el DNI' });
    pattern(campo.dni, /^\d{8}$/, { message: 'El DNI debe tener 8 dígitos' });
    min(campo.edad, 0, { message: 'La edad no es válida' });
    max(campo.edad, 120, { message: 'La edad no es válida' });
    pattern(campo.telefono, /^\d{3} ?\d{3} ?\d{3}$/, { message: 'Teléfono de 9 dígitos' });
    min(campo.raciones, 1, { message: 'Mínimo 1 ración' });
    max(campo.raciones, 20, { message: 'Máximo 20 raciones' });
  });

  constructor() {
    effect(() => {
      const b = this.inicial();
      if (b) {
        const { id, ...datos } = b;
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
