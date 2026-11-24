import { Beneficiario } from '../models/beneficiario.model';

export const BENEFICIARIOS: Beneficiario[] = [
  {
    id: 1,
    nombre: 'Familia Quispe Hilario',
    categoria: 'Grupo Familiar',
    dni: '20084512',
    edad: 38,
    telefono: '964 123 456',
    raciones: 4,
  },
  {
    id: 2,
    nombre: 'Manuel Córdova Ramos',
    categoria: 'Atención Prioritaria',
    dni: '19874421',
    edad: 72,
    telefono: '952 789 101',
    raciones: 2,
  },
  {
    id: 3,
    nombre: 'Rosa María Huamán',
    categoria: 'Beneficiario Regular',
    dni: '42195033',
    edad: 65,
    telefono: '943 552 890',
    raciones: 1,
  },
  {
    id: 4,
    nombre: 'Elena Paucar Flores',
    categoria: 'Apoyo Nutricional Escolar',
    dni: '73110294',
    edad: 8,
    telefono: '964 881 230',
    raciones: 2,
  },
  {
    id: 5,
    nombre: 'Pedro Castillo Cárdenas',
    categoria: 'Beneficiario Regular',
    dni: '20109432',
    edad: 49,
    telefono: '954 601 324',
    raciones: 3,
  },
];
