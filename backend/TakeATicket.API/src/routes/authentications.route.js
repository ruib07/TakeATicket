import express from "express";
import { authController } from "../controllers/authentications.controller.js";

export const authRoutes = (app) => {
  const router = express.Router();
  const controller = authController(app);

  router.post("/signin", controller.signin);
  router.post("/signup", controller.signup);

  return router;
};
