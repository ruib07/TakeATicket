import express from 'express';
import { authRoutes } from '../routes/authentications.route.js';
import { resetPasswordsRoutes } from '../routes/resetpasswords.route.js';
import { usersRoutes } from '../routes/users.route.js';
import { ticketsRoutes } from '../routes/tickets.route.js';
import { notificationsRoutes } from '../routes/notifications.route.js';
import { passportConfig } from './passport.js';

export const setupRoutes = (app) => {
  const publicRouter = express.Router();
  const secureRouter = express.Router();
  const passportAuth = passportConfig(app).authenticate;

  app.use('/v1/auth', authRoutes(app));
  app.use('/v1/reset-password', resetPasswordsRoutes(app));

  publicRouter.use('/users', (req, res, next) => {
    const usersRouter = express.Router();
    usersRouter.post('/', usersRoutes(app).stack.find((r) => r.route.path === '/').route.stack[0].handle);
    return usersRouter(req, res, next);
  });

  secureRouter.use('/users', usersRoutes(app));
  secureRouter.use('/tickets', ticketsRoutes(app));
  secureRouter.use('/notifications', notificationsRoutes(app));

  app.use('/v1', publicRouter);
  app.use('/v1', passportAuth(), secureRouter);
};

