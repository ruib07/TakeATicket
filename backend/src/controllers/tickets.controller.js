import { ticketsService } from "../services/tickets.service.js";

export const ticketsController = (app) => {
  const ticketFromDb = ticketsService(app);

  const getAllTickets = async (req, res, next) => {
    try {
      const tickets = await ticketFromDb.findAll();
      return res.status(200).json(tickets);
    } catch (error) {
      return next(error);
    }
  };

  const getTicketById = async (req, res, next) => {
    try {
      const ticket = await ticketFromDb.find({ id: req.params.id });
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      return res.status(200).json(ticket);
    } catch (error) {
      return next(error);
    }
  };

  const createTicket = async (req, res, next) => {
    try {
      const newTicket = req.body;
      const result = await ticketFromDb.save(newTicket);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  };

  const updateTicket = async (req, res, next) => {
    try {
      const updatedTicketInfo = req.body;
      const result = await ticketFromDb.update(req.params.id, updatedTicketInfo);
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };

  const deleteTicket = async (req, res, next) => {
    try {
      await ticketFromDb.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  return {
    getAllTickets,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };
};
