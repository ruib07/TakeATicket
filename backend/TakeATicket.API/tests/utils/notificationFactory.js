import { v4 as uuidv4 } from "uuid";

export const generateNotification = (overrides = {}) => ({
  ticket_id: overrides.ticket_id ?? null,
  user_id: overrides.user_id ?? null,
  admin_id: overrides.admin_id ?? null,
  content: "content" in overrides ? overrides.content : `Content/${uuidv4()}`,
  status: "status" in overrides ? overrides.status : "unread",
});
