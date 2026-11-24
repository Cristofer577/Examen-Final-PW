export interface Usuario {
  id: number;
  nombre: string;
  usuario: string;
  rol: string;
}

export interface LoginEntrada {
  usuario: string;
  clave: string;
}

export interface TokenSalida {
  token: string;
  usuario: Usuario;
}
