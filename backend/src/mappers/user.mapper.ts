// Define funciones puras de transformación para mapear entre los tipos de dominio User y los DTOs.
// Se utilizan para adaptar los datos entre las distintas capas de la arquitectura.

import {
  type CreateUserDto,
  type UpdateUserDto,
  type UserResponseDto,
} from '../dtos/user.dto';
import {
  type IUser,
  type IUserCreate,
  type IUserUpdate,
} from '../interfaces/user.interface';

export const toUserResponse = (u: IUser): UserResponseDto => ({
  id: u.id,
  name: u.name,
  email: u.email,
  birthday: u.birthday.toISOString(),
  isBlocked: u.isBlocked,
  createdAt: u.createdAt.toISOString(),
  updatedAt: u.updatedAt.toISOString(),
});

export const toCreateUserInput = (dto: CreateUserDto): IUserCreate => ({
  name: dto.name,
  email: dto.email,
  password: dto.password,
  birthday: new Date(dto.birthday),
  isBlocked: false,
});

export const toUpdateUserInput = (dto: UpdateUserDto): IUserUpdate => {
  const input: IUserUpdate = {};

  if (dto.name !== undefined) input.name = dto.name;
  if (dto.email !== undefined) input.email = dto.email;
  if (dto.password !== undefined) input.password = dto.password;
  if (dto.birthday !== undefined) input.birthday = new Date(dto.birthday);
  if (dto.isBlocked !== undefined) input.isBlocked = dto.isBlocked;

  return input;
};
