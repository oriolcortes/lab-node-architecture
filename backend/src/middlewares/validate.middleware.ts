// Middleware para validar los payloads de las peticiones usando esquemas Joi.
// Garantiza que las solicitudes entrantes cumplan con la estructura y los tipos de datos requeridos.

import {
  RequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import type Joi from 'joi';
import { httpStatus } from '../config/httpStatusCodes';
import logger from '../config/logger';

export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
}

export const validate = <ReqParams, ReqBody, ReqQuery>(
  schema: Joi.ObjectSchema,
  source: ValidationSource
): RequestHandler<ReqParams, unknown, ReqBody, ReqQuery> => {
  return (
    req: Request<ReqParams, never, ReqBody, ReqQuery>,
    res: Response,
    next: NextFunction
  ): void => {
    logger.debug(
      { data: req[source] },
      `Validation middleware: Validating request ${source}`
    );

    const objToValidate: ReqParams | ReqBody | ReqQuery = req[source];
    if (!objToValidate) {
      logger.warn(`Validation middleware: No data found in request ${source}`);
      next(new Error('Validation type not supported'));
      return;
    }
    const result = schema.validate(objToValidate, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });
    if (result.error) {
      logger.warn(
        { errors: result.error.details.map((detail) => detail.message) },
        'Validation middleware: Validation errors'
      );
      const responseObj = {
        msg: result.error.details.map((detail) => detail.message),
      };
      res.status(httpStatus.BAD_REQUEST).send(responseObj);
    } else {
      logger.debug('Validation middleware: Validation successful');
      next();
    }
  };
};
