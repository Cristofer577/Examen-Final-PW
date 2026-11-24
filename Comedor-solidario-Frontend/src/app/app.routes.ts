import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Login } from './components/pages/login/login';
import { Inicio } from './components/pages/inicio/inicio';
import { Beneficiarios } from './components/pages/beneficiarios/beneficiarios';
import { RacionesDiarias } from './components/pages/raciones-diarias/raciones-diarias';
import { Inventario } from './components/pages/inventario/inventario';
import { Reportes } from './components/pages/reportes/reportes';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio },
      { path: 'beneficiarios', component: Beneficiarios },
      { path: 'raciones', component: RacionesDiarias },
      { path: 'inventario', component: Inventario },
      { path: 'reportes', component: Reportes },
    ],
  },
  { path: '**', redirectTo: '' },
];
