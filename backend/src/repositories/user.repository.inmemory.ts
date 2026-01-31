// Gestiona las operaciones directas de datos relacionadas con usuarios.
// Esta capa interactúa con la base de datos u otra fuente de datos para realizar operaciones CRUD.
// Usa array en memoria para simular una base de datos.

import logger from '../config/logger';
import { IUser, IUserCreate, IUserUpdate } from '../interfaces/user.interface';

const usersDB = [
  {
    id: '1',
    name: 'John Doe',
    email: 'johndoe@test.com',
    password: 'hashedpassword',
    birthday: new Date('1990-01-01'),
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'janesmith@test.com',
    password: 'hashedpassword',
    birthday: new Date('1985-05-15'),
    isBlocked: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class UserRepository {
  getAll = (
    filters: { includeBlocked?: boolean },
    pagination: { skip: number; limit: number }
  ): IUser[] => {
    logger.debug(`Repository: Finding users`);
    pagination.skip = pagination.skip || 0;
    pagination.limit =
      !pagination.limit || pagination.limit === 0
        ? usersDB.length
        : pagination.limit;
    const users = usersDB
      .filter((user) => (filters.includeBlocked ? true : !user.isBlocked))
      .slice(pagination.skip, pagination.skip + pagination.limit);
    logger.debug(`Repository: Found ${users.length} users`);
    return users;
  };

  getById = (id: string): IUser | null => {
    logger.debug(`Repository: Finding user by ID: ${id}`);
    const user = usersDB.find((user) => user.id === id) || null;
    if (user) {
      logger.debug(`Repository: User found: ${user.name}`);
    } else {
      logger.debug(`Repository: User with ID ${id} not found`);
    }
    return user;
  };

  delete = (id: string): IUser | null => {
    logger.debug(`Repository: Deleting user with id: ${id}`);
    const index = usersDB.findIndex((user) => user.id === id);
    if (index === -1) {
      logger.debug(`Repository: User with ID ${id} not found`);
      return null;
    }
    const [deletedUser] = usersDB.splice(index, 1);
    logger.debug(`Repository: User with ID ${id} deleted`);
    return deletedUser;
  };

  getByEmail = (email: string): IUser | null => {
    logger.debug(`Repository: Fetching user by email: ${email}`);
    const userFound = usersDB.find((user) => user.email === email);
    if (!userFound) {
      logger.debug(`Repository: No user found with email: ${email}`);
      return null;
    }
    logger.debug(`Repository: User with email ${email} fetched`);
    return userFound;
  };

  create = (data: IUserCreate): IUser => {
    logger.debug('Repository: Creating user with data', { data });
    usersDB.push({
      ...data,
      id: (usersDB.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const createdUser = usersDB[usersDB.length - 1];
    logger.debug(
      {
        user: createdUser,
      },
      'Repository: User created'
    );
    return createdUser as IUser;
  };

  update = (id: string, data: IUserUpdate): IUser => {
    logger.debug(`Repository: Updating user with data: ${{ id, data }}`);
    const index = usersDB.findIndex((user) => user.id === id);
    const user = usersDB[index] as IUser;
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.password !== undefined) user.password = data.password;
    if (data.birthday !== undefined) user.birthday = data.birthday;
    if (data.isBlocked !== undefined) user.isBlocked = data.isBlocked;
    user.updatedAt = new Date();
    logger.debug(
      {
        user: usersDB[index],
      },
      'Repository: User updated'
    );
    return usersDB[index];
  };
}
