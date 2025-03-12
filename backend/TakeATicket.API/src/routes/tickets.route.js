import express from "express";
import { ticketsController } from "../controllers/tickets.controller.js";

export const ticketsRoutes = (app) => {
  const router = express.Router();
  const controller = ticketsController(app);

  router.get("/", controller.getAllTickets);
  router.get("/:id", controller.getTicketById);
  router.get("/byadmin/:admin_id", controller.getTicketsByAdmin);
  router.get("/byuser/:user_id", controller.getTicketsByUser);
  router.post("/", controller.createTicket);
  router.put("/:id", controller.updateTicket);
  router.delete("/:id", controller.deleteTicket);

  return router;
};
