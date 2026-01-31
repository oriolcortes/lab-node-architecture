// Implementa la lógica de negocio para las operaciones de autenticación.
// Procesa las solicitudes del controlador e interactúa con el repositorio cuando es necesario.

import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';
import { AppError } from '../utils/application.error';
import { UserRepository } from '../repositories/user.repository';
import { PasswordHelper } from '../utils/password.helper';
import { TokenHelper } from '../utils/token.helper';
import { IAuthResult, ILogin } from '../interfaces/auth.interface';

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  login = async (data: ILogin): Promise<IAuthResult> => {
    logger.debug(`AuthService: Attempting login for email: ${data.email}`);
    const user = await this.userRepository.getByEmail(data.email);
    if (!user) {
      logger.warn(`AuthService: User not found for email: ${data.email}`);
      throw new AppError('User not found', httpStatus.NOT_FOUND);
    }
    if (user.isBlocked) {
      logger.warn(`AuthService: User with email ${data.email} is blocked`);
      throw new AppError('User is blocked', httpStatus.FORBIDDEN);
    }
    const isPasswordValid = await PasswordHelper.comparePasswords(
      data.password,
      user.password
    );
    if (!isPasswordValid) {
      logger.warn(`AuthService: Invalid password for email: ${data.email}`);
      throw new AppError('Invalid password', httpStatus.UNAUTHORIZED);
    }
    const token = TokenHelper.generateToken({ id: user.id });
    logger.info(`AuthService: Login successful for email: ${data.email}`);
    return { user, accessToken: token };
  };
}
