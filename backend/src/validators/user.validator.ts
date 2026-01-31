// Define los esquemas Joi para validar las peticiones relacionadas con usuarios.
// Garantiza que los datos entrantes cumplan con la estructura y las reglas requeridas.

import Joi from 'joi';

export class UserValidator {
  // Opciones comunes que se deben usar al validar:
  // schema.validate(input, { abortEarly: false, convert: true, stripUnknown: true });

  private static readonly id = Joi.string().trim();

  private static readonly email = Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: false } }); // Desactiva la validación de TLD para mayor flexibilidad

  private static readonly name = Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[\p{L}\p{M} ]+$/u); // Permite letras (incluidas acentuadas) y espacios

  private static readonly password = Joi.string().trim();

  // Acepta strings de fecha ISO u objetos Date; Joi los convertirá si { convert: true }.
  private static readonly birthday = Joi.date().iso();

  // Coerción equivalente a normalizeUserData() (strings truthy/falsy y números) si { convert: true }.
  private static readonly isBlocked = Joi.boolean()
    .truthy(1, '1', 'true', 'yes', 'y', 'sí', 'si')
    .falsy(0, '0', 'false', 'no', 'n');

  // Paginación: permite strings del querystring y los convierte a números si { convert: true }.
  private static readonly skip = Joi.number().integer().min(0);
  private static readonly limit = Joi.number().integer().min(1).max(100);

  static readonly userIdSchema = Joi.object({
    id: UserValidator.id.required(),
  });

  static readonly userPaginationSchema = Joi.object({
    skip: UserValidator.skip,
    limit: UserValidator.limit,
  }).and('skip', 'limit'); // ambos o ninguno

  static readonly userCreateSchema = Joi.object({
    name: UserValidator.name.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    birthday: UserValidator.birthday.required(),
    // si se quiere permitir crear con isBlocked, añadirlo aquí:
    // isBlocked: UserValidator.isBlocked.default(false),
  });

  static readonly userUpdateSchema = Joi.object({
    name: UserValidator.name,
    email: UserValidator.email,
    password: UserValidator.password,
    birthday: UserValidator.birthday,
    isBlocked: UserValidator.isBlocked,
  }).min(1); // evita peticiones PATCH/PUT vacías
}
