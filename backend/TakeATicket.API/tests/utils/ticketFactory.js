import { v4 as uuidv4 } from "uuid";

export const generateTicket = (overrides = {}) => ({
  title:
    "title" in overrides ? overrides.title : `Ticket-${uuidv4().slice(0, 6)}`,
  description:
    "description" in overrides
      ? overrides.description
      : `Description-${uuidv4()}.`,
  deadline: "deadline" in overrides ? overrides.deadline : new Date(),
  status: "status" in overrides ? overrides.status : "pending",
  user_id: overrides.user_id ?? null,
  admin_id: overrides.admin_id ?? null,
});
