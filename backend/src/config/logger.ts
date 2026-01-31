// Manages application logging configuration.
// This file centralizes the setup of the logging mechanism using Pino, ensuring consistent log formatting, levels, and transports across the entire application.
// It exports a reusable logger instance that can be imported in any module for structured logging.
// In production, it is recommended to use a structured logging system like Pino, as it offers better performance and facilitates log analysis. However, for testing or basic examples, console.log may be sufficient.

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
