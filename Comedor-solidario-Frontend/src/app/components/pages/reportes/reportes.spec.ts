import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Reportes } from './reportes';

describe('Reportes', () => {
  let component: Reportes;
  let fixture: ComponentFixture<Reportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reportes],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Reportes);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.endsWith('/reportes/raciones'))
      .flush({
        desde: '2026-11-17',
        hasta: '2026-11-23',
        meta: 180,
        total: 0,
        promedio: 0,
        dias: [],
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
