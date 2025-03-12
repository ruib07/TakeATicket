import { v4 as uuidv4 } from "uuid";

export const generateTicket = (overrides = {}) => ({
  title: overrides.title || `Ticket-${uuidv4().slice(0, 6)}`,
  description: overrides.description || `Description-${uuidv4()}.`,
  deadline: overrides.deadline || new Date(),
  status: overrides.status || "pending",
  user_id: overrides.user_id || null,
  admin_id: overrides.admin_id || null,
});
