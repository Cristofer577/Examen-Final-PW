import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Sesion } from '../sesion';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let peticiones: HttpTestingController;
  let sesion: Sesion;

  const usuario = {
    id: 1,
    nombre: 'Yolanda Quispe',
    usuario: '10458921',
    rol: 'Encargada General',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    peticiones = TestBed.inject(HttpTestingController);
    sesion = TestBed.inject(Sesion);
    sesion.limpiar();
  });

  afterEach(() => {
    peticiones.verify();
    sesion.limpiar();
  });

  it('agrega el token en las peticiones a la API', () => {
    sesion.guardar('abc123', usuario);

    http.get(`${environment.apiUrl}/resumen`).subscribe();

    const peticion = peticiones.expectOne(`${environment.apiUrl}/resumen`);
    expect(peticion.request.headers.get('Authorization')).toBe('Bearer abc123');
    peticion.flush({});
  });

  it('no agrega el token cuando no hay sesión', () => {
    http.get(`${environment.apiUrl}/resumen`).subscribe();

    const peticion = peticiones.expectOne(`${environment.apiUrl}/resumen`);
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush({});
  });

  it('no agrega el token en peticiones a otros dominios', () => {
    sesion.guardar('abc123', usuario);

    http.get('https://ejemplo.com/datos').subscribe();

    const peticion = peticiones.expectOne('https://ejemplo.com/datos');
    expect(peticion.request.headers.has('Authorization')).toBe(false);
    peticion.flush({});
  });

  it('limpia la sesión y redirige al login ante un 401 de la API', () => {
    sesion.guardar('abc123', usuario);
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate');

    http.get(`${environment.apiUrl}/beneficiarios`).subscribe({ error: () => {} });

    const peticion = peticiones.expectOne(`${environment.apiUrl}/beneficiarios`);
    peticion.flush(
      { detail: 'Sesión no válida o expirada' },
      { status: 401, statusText: 'Unauthorized' },
    );

    expect(sesion.token()).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/login']);
  });
});
