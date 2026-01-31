// Funciones utilitarias para gestionar operaciones relacionadas con tokens.
// Incluye funcionalidades como generar, verificar y decodificar JSON Web Tokens (JWT).
// Garantiza una gestión segura y consistente de los tokens en toda la aplicación.

import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config';
import { httpStatus } from '../config/httpStatusCodes';
import { AppError } from './application.error';
import logger from '../config/logger';

export class TokenHelper {
  static readonly generateToken = (payload: object): string => {
    logger.debug(
      { payloadSummary: Object.keys(payload) },
      'TokenHelper: Generating token'
    );

    const options: jwt.SignOptions = {
      expiresIn: '1h',
    };
    if (!SECRET_KEY) {
      logger.error('TokenHelper: SECRET_KEY is not defined');
      throw new AppError(
        'SECRET_KEY is not defined',
        httpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const token = jwt.sign(payload, SECRET_KEY, options);
    logger.debug('TokenHelper: Token generated successfully');
    return token;
  };
}
