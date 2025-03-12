import express from "express";
import { resetPasswordsController } from "../controllers/resetpasswords.controller.js";

export const resetPasswordsRoutes = (app) => {
  const router = express.Router();
  const controller = resetPasswordsController(app);

  router.post("/send-email", controller.requestPasswordReset);
  router.put("/change-password", controller.changePassword);

  return router;
};
