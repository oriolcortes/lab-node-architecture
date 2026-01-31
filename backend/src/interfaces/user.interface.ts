// Contiene la interfaz principal de User y todos los tipos de dominio relacionados.
// Garantiza un manejo coherente y seguro a nivel de tipos de los datos de usuario en toda la aplicación.

export interface IUser {
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

export type IUserCreate = Omit<IUser, SystemKeys>;

export type IUserUpdate = Partial<Omit<IUser, SystemKeys>>;
