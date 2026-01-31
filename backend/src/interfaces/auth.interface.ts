// Contiene la interfaz principal de User y todos los tipos de dominio relacionados.
// Garantiza un manejo coherente y seguro a nivel de tipos de los datos de autenticación en toda la aplicación.

import { IUser } from './user.interface';

export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthResult {
  user: IUser;
  accessToken: string;
}
