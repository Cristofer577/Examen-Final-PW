import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Beneficiarios } from './beneficiarios';

describe('Beneficiarios', () => {
  let component: Beneficiarios;
  let fixture: ComponentFixture<Beneficiarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Beneficiarios],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Beneficiarios);
    component = fixture.componentInstance;
    TestBed.inject(HttpTestingController)
      .expectOne((req) => req.url.endsWith('/beneficiarios'))
      .flush([]);
    await fixture.whenStable();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
