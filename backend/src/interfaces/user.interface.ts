// Contiene la interfaz principal de User y todos los tipos de dominio relacionados.
// Garantiza un manejo coherente y seguro a nivel de tipos de los datos de usuario en toda la aplicación.

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  birthday: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type SystemKeys = 'id' | 'createdAt' | 'updatedAt';

export type UserCreate = Omit<User, SystemKeys>;

export type UserUpdate = Partial<Omit<User, SystemKeys>>;
