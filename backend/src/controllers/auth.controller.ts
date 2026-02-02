// Gestiona las peticiones HTTP relacionadas con autenticación.
// Contiene los métodos que manejan rutas como GET, POST, PATCH y DELETE para usuarios.
// Delega la lógica de negocio al servicio de usuarios.

import { NextFunction, type Request, type Response } from 'express';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { AppError } from '../utils/application.error';
import { toCreateUserInput, toUserResponse } from '../mappers/user.mapper';
import { toAuthResponse, toLoginInput } from '../mappers/auth.mapper';
import { handleControllerError } from '../utils/logger.helper';

export class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const body = req.body;
    logger.debug(`Controller: Received login request for email: ${body.email}`);
    try {
      const userToLogin = toLoginInput(body);
      const authResult = await this.authService.login(userToLogin);
      const data = toAuthResponse(authResult);

      const response = {
        message: 'Login successful',
        data,
      };
      logger.info(`Controller: User logged in successfully: ${body.email}`);
      res.send(response);
    } catch (error) {
      next(handleControllerError(error, 'Login failed'));
    }
  };

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const body = req.body;
    logger.debug(
      { body },
      `Controller: Received registration request for email: ${body.email}`
    );
    try {
      logger.debug(`User registration attempt: ${body.email}`);
      const userToRegister = toCreateUserInput(body);
      const user = await this.userService.create(userToRegister);
      const data = toUserResponse(user);

      const response = {
        message: 'User registered successfully',
        data,
      };
      logger.info(`Controller: User registered successfully: ${body.email}`);
      res.status(httpStatus.CREATED).send(response);
    } catch (error) {
      next(handleControllerError(error, 'Error registering user'));
    }
  };
}
