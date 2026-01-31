// Configura el servidor Express, los middlewares, las rutas, el manejo de errores y la conexión a la base de datos.

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { CLIENT_URL } from './config/config';
import { createConnection } from './config/db';

// Initialize express
export const app = express();
app.disable('x-powered-by');

// Allow cors for all connexions (development)
app.use(cors());
// Allow cors for especific client url (production)
app.use(cors({ origin: CLIENT_URL }));

// Connect to the database
void (async () => {
  await createConnection();
})();

app.get('/health', (_req, res) => {
  const isConnected = mongoose.connection.readyState === 1;

  res.status(isConnected ? 200 : 500).json({
    status: isConnected ? 'ok' : 'error',
    uptime: process.uptime(),
    db: { connected: isConnected },
  });
});
