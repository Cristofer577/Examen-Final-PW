import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, FormField, maxLength, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { mensajeError } from '../../../core/http/errores';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormField],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router = inject(Router);
  private auth = inject(AuthService);

  mostrarClave = signal(false);
  cargando = signal(false);
  error = signal<string | null>(null);

  modelo = signal({ usuario: '', clave: '' });

  loginForm = form(this.modelo, (campo) => {
    required(campo.usuario, { message: 'Escribe tu DNI o usuario' });
    maxLength(campo.usuario, 30, { message: 'Máximo 30 caracteres' });
    required(campo.clave, { message: 'Escribe tu contraseña' });
  });

  alternarClave() {
    this.mostrarClave.update((v) => !v);
  }

  accesoRapido(tipo: 'encargada' | 'socia') {
    this.error.set(null);
    this.modelo.set(
      tipo === 'encargada'
        ? { usuario: '10458921', clave: 'demo123' }
        : { usuario: 'socia.turno', clave: 'demo123' },
    );
  }

  ingresar() {
    submit(this.loginForm, async () => {
      this.cargando.set(true);
      this.error.set(null);

      const { usuario, clave } = this.modelo();
      try {
        await firstValueFrom(this.auth.login({ usuario, clave }));
        await this.router.navigate(['/inicio']);
      } catch (e) {
        this.error.set(mensajeError(e));
      } finally {
        this.cargando.set(false);
      }
    });
  }
}
