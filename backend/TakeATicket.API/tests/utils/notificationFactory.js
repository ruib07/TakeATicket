export const generateNotification = (overrides = {}) => ({
  ticket_id: overrides.ticket_id || null,
  user_id: overrides.user_id || null,
  admin_id: overrides.admin_id || null,
  status: overrides.status || "unread",
});
