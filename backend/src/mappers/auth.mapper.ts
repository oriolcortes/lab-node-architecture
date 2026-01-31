// Define funciones puras de transformación para mapear entre los tipos de dominio Auth y los DTOs.
// Se utilizan para adaptar los datos entre las distintas capas de la arquitectura.

import { type AuthResponseDto, type LoginDto } from '../dtos/auth.dto';
import { IAuthResult } from '../interfaces/auth.interface';

export const toAuthResponse = (auth: IAuthResult): AuthResponseDto => ({
  user: {
    id: auth.user.id,
    name: auth.user.name,
    email: auth.user.email,
    birthday: auth.user.birthday.toISOString(),
    isBlocked: auth.user.isBlocked,
    createdAt: auth.user.createdAt.toISOString(),
    updatedAt: auth.user.updatedAt.toISOString(),
  },
  accessToken: auth.accessToken,
});

export const toLoginInput = (body: LoginDto) => ({
  email: body.email,
  password: body.password,
});
