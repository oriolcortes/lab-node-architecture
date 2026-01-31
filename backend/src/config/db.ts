// Gestiona la conexión y la configuración de la base de datos.
// Este archivo se encarga de inicializar y exportar la instancia de la base de datos.

import mongoose, { type ConnectOptions } from 'mongoose';
import { logError } from '../utils/logger.helper';
import { DATABASE_URL } from './config';
import logger from './logger';

export const createConnection = async () => {
  try {
    const options: ConnectOptions = {};

    if (!DATABASE_URL) {
      throw new Error('DATABASE_URL is not defined');
    }

    logger.info('Attempting to connect to the DB...');
    await mongoose.connect(DATABASE_URL, options);
    logger.info('Connected to the DB');

    mongoose.connection.on('error', (error: unknown) => {
      logError(error, 'The connection was interrupted');
      process.exit(1);
    });
  } catch (error: unknown) {
    logError(error, 'Cannot connect to the DB');
    process.exit(1);
  }
};

export const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error: unknown) {
    logError(error, 'Error closing the database connection');
  }
};
