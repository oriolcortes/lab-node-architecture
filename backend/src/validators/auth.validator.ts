// Define los esquemas Joi para validar las peticiones relacionadas con autenticación.
// Garantiza que los datos entrantes cumplan con la estructura y las reglas requeridas.

import Joi from 'joi';

export class AuthValidator {
  private static readonly email = Joi.string().email();
  private static readonly password = Joi.string();

  static readonly loginSchema = Joi.object({
    email: AuthValidator.email.required(),
    password: AuthValidator.password.required(),
  });
}
