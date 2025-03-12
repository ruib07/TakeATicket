import ValidationError from "../errors/validationError.js";

export const notificationsService = (app) => {
  const findAll = (filter = {}) => app.db("notifications").where(filter);

  const find = (filter = {}) => app.db("notifications").where(filter).first();

  const save = (newNotification) => {
    if (!newNotification.status)
      throw new ValidationError("Status is required!");

    return app.db("notifications").insert(newNotification, "*");
  };

  const update = (id, notificationRes) =>
    app
      .db("notifications")
      .where({ id })
      .update({ status: "read", ...notificationRes }, "*");

  const remove = (id) => app.db("notifications").where({ id }).del();

  return {
    findAll,
    find,
    save,
    update,
    remove,
  };
};
