// Gestiona la configuración del sistema de logging de la aplicación.
// Este archivo centraliza la configuración del mecanismo de logging utilizando Pino, garantizando un formato de logs, niveles y canales de salida coherentes en toda la aplicación.
// Exporta una instancia reutilizable del logger que puede importarse en cualquier módulo para realizar logging estructurado.
// En producción, se recomienda utilizar un sistema de logging estructurado como Pino, ya que ofrece mejor rendimiento y facilita el análisis de logs. No obstante, para pruebas o ejemplos básicos, console.log puede ser suficiente.

import pino from 'pino';
import { LOG_LEVEL } from './config';

const logger = pino({
  level: LOG_LEVEL,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
    },
  },
});

export default logger;
