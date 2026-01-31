// Funciones utilitarias para gestionar operaciones relacionadas con contraseñas.
// Incluye funcionalidades como el hash de contraseñas y la comparación de contraseñas hasheadas.
// Diseñadas para garantizar consistencia y seguridad en toda la aplicación.

import bcrypt from 'bcrypt';

export class PasswordHelper {
  static readonly hashPassword = (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };

  static readonly comparePasswords = (
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword);
  };
}
