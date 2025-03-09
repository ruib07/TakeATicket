import express from 'express';
import { ticketsController } from '../controllers/tickets.controller.js';

export const ticketsRoutes = (app) => {
  const router = express.Router();
  const controller = ticketsController(app);

  router.get('/', controller.getAllTickets);
  router.get('/:id', controller.getTicketById);
  router.post('/', controller.createTicket);
  router.put('/:id', controller.updateTicket);
  router.delete('/:id', controller.deleteTicket);

  return router;
};
