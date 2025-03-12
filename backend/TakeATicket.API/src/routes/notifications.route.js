import express from "express";
import { notificationsController } from "../controllers/notifications.controller.js";

export const notificationsRoutes = (app) => {
  const router = express.Router();
  const controller = notificationsController(app);

  router.get("/", controller.getAllNotifications);
  router.get("/:id", controller.getNotificationById);
  router.post("/", controller.createNotification);
  router.put("/:id", controller.updateNotification);
  router.delete("/:id", controller.deleteNotification);

  return router;
};
