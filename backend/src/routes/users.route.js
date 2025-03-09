import express from 'express';
import { usersController } from '../controllers/users.controller.js';

export const usersRoutes = (app) => {
  const router = express.Router();
  const controller = usersController(app);

  router.get('/', controller.getAllUsers);
  router.get('/:id', controller.getUserById);
  router.put('/:id', controller.updateUser);
  router.delete('/:id', controller.deleteUser);

  return router;
};
