import { resetPasswordsService } from "../services/resetpasswords.service.js";
import { usersService } from "../services/users.service.js";

export const resetPasswordsController = (app) => {
  const userFromDb = usersService(app);
  const resetPasswordFromDb = resetPasswordsService(app);

  const requestPasswordReset = async (req, res, next) => {
    try {
      const user = await userFromDb.find({ email: req.body.email });

      if (user) {
        await resetPasswordFromDb.sendPasswordResetEmail(
          req.body.email,
          user.id,
        );
      }
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      return next(error);
    }
  };

  const changePassword = async (req, res, next) => {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      const tokenRecord = await app
        .db("resetpasswordtokens")
        .where({ token })
        .first();

      if (!tokenRecord || new Date() > tokenRecord.expirydate) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      await userFromDb.update(tokenRecord.user_id, { password: newPassword });
      await app.db("resetpasswordtokens").where({ token }).del();

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return next(error);
    }
  };

  return {
    requestPasswordReset,
    changePassword,
  };
};
