export const generateChangePassword = (overrides = {}) => ({
  token: overrides.token || "validtoken456",
  newPassword: overrides.newPassword || "New@Password-123",
  confirmNewPassword: overrides.confirmNewPassword || "New@Password-123",
});
