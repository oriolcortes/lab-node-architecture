// Archivo principal de rutas que configura y combina todas las rutas de la API.
// Incluye los middlewares y el manejo de errores de la aplicación.

import express, { Router } from 'express';
import { errorMiddleware } from '../middlewares/error.middleware';
import { userRouter } from './user.routes';

export const baseRouter = Router();

baseRouter.use(express.json());

baseRouter.use('/users', userRouter);

baseRouter.use(errorMiddleware);
