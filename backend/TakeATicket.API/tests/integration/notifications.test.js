import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";
import { createAndAuthenticateUser } from "../utils/testHelpers.js";
import { generateTicket } from "../utils/ticketFactory.js";
import app from "../../src/app.js";
import { generateNotification } from "../utils/notificationFactory.js";

const route = "/v1/notifications";

let user, admin, ticket;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
  admin = await createAndAuthenticateUser({ role: "admin" });
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const ticketResponse = await supertest(app)
    .post("/v1/tickets")
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);

  ticket = ticketResponse.body[0];
});

test("Test #38 - Should return all notifications", async () => {
  const response = await supertest(app)
    .get(route)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test #39 - Should return a notification by his ID", async () => {
  const newNotification = generateNotification({
    ticket_id: ticket.id,
    user_id: user.id,
    admin_id: admin.id,
  });

  const createNotificationResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newNotification);
  expect(createNotificationResponse.statusCode).toBe(201);

  const createdNotification = createNotificationResponse.body[0];

  const notificationResponse = await supertest(app)
    .get(`${route}/${createdNotification.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(notificationResponse.statusCode).toBe(200);
});

test("Test #40 - Should return not found message when notification does not exist", async () => {
  const response = await supertest(app)
    .get(`${route}/${uuidv4()}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(404);
  expect(response.body.error).toBe("Notification not found");
});

test("Test #41 - Should create a new notification successfully", async () => {
  const newNotification = generateNotification({
    ticket_id: ticket.id,
    user_id: user.id,
    admin_id: admin.id,
  });

  const response = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newNotification);

  expect(response.statusCode).toBe(201);
  expect(response.body[0]).toHaveProperty("id");
  expect(response.body[0]).toHaveProperty("ticket_id", ticket.id);
  expect(response.body[0]).toHaveProperty("user_id", user.id);
  expect(response.body[0]).toHaveProperty("admin_id", admin.id);
  expect(response.body[0]).toHaveProperty("status", newNotification.status);
});

describe("Notification creation validation", () => {
  const testTemplate = async (newData, errorMessage) => {
    const notification = generateNotification({
      ticket_id: ticket.id,
      user_id: user.id,
      admin_id: admin.id,
      ...newData,
    });

    const response = await supertest(app)
      .post(route)
      .set("Authorization", `Bearer ${user.token}`)
      .send(notification);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(errorMessage);
  };

  test("Test #42 - Insert a notification without a status", () =>
    testTemplate({ status: null }, "Status is required!"));
});

test("Test #43 - Should update a notification successfully", async () => {
  const newNotification = generateNotification({
    ticket_id: ticket.id,
    user_id: user.id,
    admin_id: admin.id,
  });

  const createNotificationResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newNotification);
  expect(createNotificationResponse.statusCode).toBe(201);

  const createdNotification = createNotificationResponse.body[0];

  const updatedNotification = generateNotification({
    ticket_id: ticket.id,
    user_id: user.id,
    admin_id: admin.id,
    status: "read",
  });

  const updateNotificationResponse = await supertest(app)
    .put(`${route}/${createdNotification.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .send(updatedNotification);

  expect(updateNotificationResponse.statusCode).toBe(200);
  expect(updateNotificationResponse.body).toHaveProperty("id");
  expect(updateNotificationResponse.body).toHaveProperty(
    "ticket_id",
    ticket.id,
  );
  expect(updateNotificationResponse.body).toHaveProperty("user_id", user.id);
  expect(updateNotificationResponse.body).toHaveProperty("admin_id", admin.id);
  expect(updateNotificationResponse.body).toHaveProperty(
    "status",
    updatedNotification.status,
  );
});

test("Test #44 - Should delete a notification by his ID", async () => {
  const existingNotification = generateNotification({
    ticket_id: ticket.id,
    user_id: user.id,
    admin_id: admin.id,
  });

  const createNotificationResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(existingNotification);
  expect(createNotificationResponse.statusCode).toBe(201);

  const createdNotification = createNotificationResponse.body[0];

  const deleteNotificationResponse = await supertest(app)
    .delete(`${route}/${createdNotification.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(deleteNotificationResponse.statusCode).toBe(204);
});
