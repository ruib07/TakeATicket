import { ITicket } from "@/@types/ticket";
import apiRequest from "./helpers/api.service";

export const GetTickets = async () =>
  apiRequest("GET", "tickets", undefined, true);

export const GetTicketById = async (ticketId: string) =>
  apiRequest("GET", `tickets/${ticketId}`, undefined, true);

export const CreateTicket = async (newTicket: ITicket) =>
  apiRequest("POST", "tickets", newTicket, true);

export const UpdateTicket = async (
  ticketId: string,
  updateTicket: Partial<ITicket>
) => apiRequest("PUT", `tickets/${ticketId}`, updateTicket, true);

export const DeleteTicket = async (ticketId: string) =>
  apiRequest("DELETE", `tickets/${ticketId}`, undefined, true);
