import logger from '../config/logger';

export function logError(err: unknown, msg: string) {
  if (err instanceof Error) {
    logger.error({ message: err.message, stack: err.stack }, msg);
  } else {
    logger.error({ err }, msg);
  }
}
