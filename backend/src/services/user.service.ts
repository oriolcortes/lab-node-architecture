// Implementa la lógica de negocio para las operaciones de usuario.
// Procesa las solicitudes del controlador e interactúa con el repositorio cuando es necesario.

import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { User, UserCreate, UserUpdate } from '../interfaces/user.interface';
import { UserRepository } from '../repositories/user.repository.inmemory';
import { PasswordHelper } from '../utils/password.helper';
import { AppError } from '../utils/application.error';

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private readonly getAge = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthday.getDate())
    ) {
      age--;
    }
    logger.debug({ birthday, age }, 'Calculated age');
    return age;
  };

  getAll = async (pagination: {
    skip: number;
    limit: number;
  }): Promise<User[]> => {
    logger.debug(`Service: Fetching all users`);
    const filters = { includeBlocked: false }; // Filter logic
    return this.userRepository.getAll(filters, pagination);
  };

  getById = async (id: string): Promise<User> => {
    logger.debug(`Service: Fetching user by ID: ${id}`);
    const user = await this.userRepository.getById(id);
    if (!user) {
      logger.warn(`User with id ${id} not found`);
      throw new AppError('User not found', httpStatus.NOT_FOUND, { id });
    }
    return user;
  };

  delete = async (id: string): Promise<User> => {
    logger.debug(`Service: Deleting user with ID: ${id}`);
    const userDeleted = await this.userRepository.delete(id);
    if (!userDeleted) {
      logger.warn(`User with id ${id} not found for deletion`);
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    logger.info(`User with id ${id} deleted successfully`);
    return userDeleted;
  };

  create = async (data: UserCreate): Promise<User> => {
    const existingUser = await this.userRepository.getByEmail(data.email);
    if (existingUser) {
      logger.warn(`User with email ${data.email} already exists`);
      throw new AppError(
        'A user with this email already exists',
        httpStatus.CONFLICT,
        {
          email: data.email,
        }
      );
    }
    if (this.getAge(data.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: data.birthday,
      });
      throw new AppError(
        'User must be at least 18 years old',
        httpStatus.BAD_REQUEST,
        { birthday: data.birthday }
      );
    }
    data.password = await PasswordHelper.hashPassword(data.password);
    const createdUser = await this.userRepository.create(data);
    if (!createdUser) {
      logger.warn('User creation failed');
      throw new AppError(
        'User creation failed',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }
    logger.info(`User created successfully with email ${data.email}`);
    return createdUser;
  };

  update = async (id: string, data: UserUpdate): Promise<User> => {
    const userToUpdate = await this.userRepository.getById(id);
    if (!userToUpdate) {
      logger.warn(`User with id ${id} not found for update`);
      throw new AppError('User not found');
    }

    if (data.birthday && this.getAge(data.birthday) < 18) {
      logger.warn('User is under 18 years old', {
        birthday: data.birthday,
      });
      throw new AppError(
        'User must be at least 18 years old',
        httpStatus.CONFLICT,
        {
          email: data.email,
        }
      );
    }
    if (data.email) {
      const existingUser = await this.userRepository.getByEmail(data.email);
      if (
        existingUser &&
        existingUser.id &&
        existingUser.id.toString() !== id
      ) {
        logger.warn(`Another user with email ${data.email} already exists`);
        throw new AppError(
          'A user with this email already exists',
          httpStatus.CONFLICT,
          {
            email: data.email,
          }
        );
      }
    }
    const updatedUser = await this.userRepository.update(id, data);
    if (!updatedUser) {
      logger.warn(`User with id ${id} not found after update attempt`);
      throw new AppError('User not found', httpStatus.NOT_FOUND, { id });
    }
    logger.info(`User with id ${id} updated successfully`);
    return updatedUser;
  };
}
