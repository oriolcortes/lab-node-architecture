// Define las rutas para las operaciones relacionadas con usuarios.
// Mapea los métodos HTTP y los endpoints a los métodos correspondientes del controlador.

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { validate, ValidationSource } from '../middlewares/validate.middleware';
import { UserValidator } from '../validators/user.validator';

const userController = new UserController();
export const userRouter = Router();

userRouter.get(
  '/',
  validate(UserValidator.userPaginationSchema, ValidationSource.QUERY),
  userController.getAll
);
userRouter.get(
  '/:id',
  validate(UserValidator.userIdSchema, ValidationSource.PARAMS),
  userController.getById
);
userRouter.delete(
  '/:id',
  validate(UserValidator.userIdSchema, ValidationSource.PARAMS),
  userController.delete
);
userRouter.post(
  '/',
  validate(UserValidator.userCreateSchema, ValidationSource.BODY),
  userController.create
);
userRouter.patch(
  '/:id',
  validate(UserValidator.userIdSchema, ValidationSource.PARAMS),
  validate(UserValidator.userUpdateSchema, ValidationSource.BODY),
  userController.update
);
