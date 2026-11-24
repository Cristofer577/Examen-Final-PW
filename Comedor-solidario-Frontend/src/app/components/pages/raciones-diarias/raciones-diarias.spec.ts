import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RacionesDiarias } from './raciones-diarias';

describe('RacionesDiarias', () => {
  let component: RacionesDiarias;
  let fixture: ComponentFixture<RacionesDiarias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RacionesDiarias],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(RacionesDiarias);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.includes('/raciones/'))
      .flush({
        fecha: new Date().toLocaleDateString('en-CA'),
        meta: 180,
        servidas: 0,
        pendientes: 180,
        registros: [],
      });
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
