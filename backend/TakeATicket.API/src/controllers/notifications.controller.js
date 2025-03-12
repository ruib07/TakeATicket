import { notificationsService } from "../services/notifications.service.js";

export const notificationsController = (app) => {
  const notificationFromDb = notificationsService(app);

  const getAllNotifications = async (req, res, next) => {
    try {
      const notifications = await notificationFromDb.findAll();
      return res.status(200).json(notifications);
    } catch (error) {
      return next(error);
    }
  };

  const getNotificationById = async (req, res, next) => {
    try {
      const notification = await notificationFromDb.find({ id: req.params.id });
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }
      return res.status(200).json(notification);
    } catch (error) {
      return next(error);
    }
  };

  const createNotification = async (req, res, next) => {
    try {
      const newNotification = req.body;
      const result = await notificationFromDb.save(newNotification);
      return res.status(201).json(result);
    } catch (error) {
      return next(error);
    }
  };

  const updateNotification = async (req, res, next) => {
    try {
      const updatedNotificationInfo = req.body;
      const result = await notificationFromDb.update(
        req.params.id,
        updatedNotificationInfo,
      );
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };

  const deleteNotification = async (req, res, next) => {
    try {
      await notificationFromDb.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  return {
    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
  };
};
