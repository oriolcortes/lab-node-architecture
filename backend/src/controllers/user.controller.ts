// Gestiona las peticiones HTTP relacionadas con usuarios.
// Contiene los métodos que manejan rutas como GET, POST, PATCH y DELETE para usuarios.
// Delega la lógica de negocio al servicio de usuarios.

import { type NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import {
  toCreateUserInput,
  toUpdateUserInput,
  toUserResponse,
} from '../mappers/user.mapper';
import { UserService } from '../services/user.service';
import { AppError } from '../utils/application.error';

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    logger.debug(
      `Controller: Received getAll request with query: ${JSON.stringify(
        req.query
      )}`
    );
    try {
      const { skip = 0, limit = 0 } = req.query;
      const pagination = {
        skip: parseInt(skip as string, 10),
        limit: parseInt(limit as string, 10),
      };
      const users = await this.userService.getAll(pagination);
      const data = users.map(toUserResponse); // <- NOT exposing sensitive data

      const response = {
        message: 'Users fetched successfully',
        length: data.length,
        data,
      };
      logger.info('Controller: Users fetched successfully');
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug('Controller: Error fetching users');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching users',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.params.id;
    logger.debug(`Controller: Received getById request for user id: ${userId}`);
    try {
      const user = await this.userService.getById(userId);
      const data = toUserResponse(user);

      const response = {
        message: 'User fetched successfully',
        data,
      };
      logger.info(`Controller: User id: ${userId} fetched successfully`);
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id },
        'Controller: Error fetching user by id'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error fetching user by id',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.params.id;
    logger.debug(`Controller: Received request to delete user id: ${userId}`);
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new AppError('Invalid user id', httpStatus.BAD_REQUEST, {
          id: userId,
        });
      }
      const user = await this.userService.delete(userId);
      const data = toUserResponse(user);

      const response = {
        message: 'User deleted successfully',
        data: data,
      };
      logger.info(`Controller: User id: ${userId} deleted successfully`);
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ id: req.params.id }, 'Controller: Error deleting user');
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error deleting user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const body = req.body;
    logger.debug('Controller: Received request to create a new user', {
      body: req.body,
    });
    try {
      const userToCreate = toCreateUserInput(body);
      const user = await this.userService.create(userToCreate);
      const data = toUserResponse(user);

      const response = {
        message: 'User created successfully',
        data,
      };
      logger.info('Controller: User created successfully');
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      let appError = error;
      logger.debug({ body: req.body }, 'Controller: Error creating user');
      if (!(error instanceof AppError)) {
        appError = new AppError(
          'Error creating user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            body: req.body,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };

  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.params.id;
    const body = req.body;
    logger.debug(`Controller: Received request to update user id: ${userId}`, {
      body,
    });
    try {
      if (!userId || isNaN(Number(userId))) {
        throw new AppError('Invalid user id', httpStatus.BAD_REQUEST, {
          id: userId,
        });
      }
      if (!body) {
        throw new AppError('Request body is missing', httpStatus.BAD_REQUEST);
      }

      const userToUpdate = toUpdateUserInput(body);
      const user = await this.userService.update(userId, userToUpdate);
      const data = toUserResponse(user);

      const response = {
        message: 'User updated successfully',
        data,
      };
      logger.info(`Controller: User id: ${userId} updated successfully`);
      res.send(response);
    } catch (error) {
      let appError = error;
      logger.debug(
        { id: req.params.id, body: req.body },
        'Controller: Error updating user'
      );
      if (!(appError instanceof AppError)) {
        appError = new AppError(
          'Error updating user',
          httpStatus.INTERNAL_SERVER_ERROR,
          {
            id: req.params.id,
            body: req.body,
            originalError: appError,
          }
        );
      }
      next(appError);
    }
  };
}
