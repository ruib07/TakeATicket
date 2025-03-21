import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";
import { createAndAuthenticateUser } from "../utils/testHelpers.js";
import { generateTicket } from "../utils/ticketFactory.js";
import app from "../../src/app.js";

const route = "/v1/tickets";

let user, admin;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
  admin = await createAndAuthenticateUser({ role: "admin" });
});

test("Test - Should return all tickets", async () => {
  const response = await supertest(app)
    .get(route)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test - Should return a ticket by his ID", async () => {
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const createTicketResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);
  expect(createTicketResponse.statusCode).toBe(201);

  const createdTicket = createTicketResponse.body[0];

  const ticketResponse = await supertest(app)
    .get(`${route}/${createdTicket.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(ticketResponse.statusCode).toBe(200);
});

test("Test - Should return not found message when ticket does not exist", async () => {
  const response = await supertest(app)
    .get(`${route}/${uuidv4()}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(404);
  expect(response.body.error).toBe("Ticket not found");
});

test("Test - Should return ticket when admin is valid", async () => {
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const createTicketResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);
  expect(createTicketResponse.statusCode).toBe(201);

  const response = await supertest(app)
    .get(`${route}/byadmin/${admin.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test - Should return ticket when user is valid", async () => {
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const createTicketResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);
  expect(createTicketResponse.statusCode).toBe(201);

  const response = await supertest(app)
    .get(`${route}/byuser/${user.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test - Should create a new ticket successfully", async () => {
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const response = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);

  expect(response.statusCode).toBe(201);
  expect(response.body[0]).toHaveProperty("id");
  expect(response.body[0]).toHaveProperty("title");
  expect(response.body[0]).toHaveProperty("description");
  expect(response.body[0]).toHaveProperty("status");
  expect(response.body[0]).toHaveProperty("user_id", user.id);
  expect(response.body[0]).toHaveProperty("admin_id", admin.id);
});

describe("Ticket creation validation", () => {
  const testTemplate = async (newData, errorMessage) => {
    const newTicket = generateTicket({
      user_id: user.id,
      admin_id: admin.id,
      ...newData,
    });

    const response = await supertest(app)
      .post(route)
      .send(newTicket)
      .set("Authorization", `Bearer ${user.token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(errorMessage);
  };

  test("Test - Insert a ticket without a title", () =>
    testTemplate({ title: null }, "Title is required!"));
  test("Test - Insert a ticket without a description", () =>
    testTemplate({ description: null }, "Description is required!"));
  test("Test - Insert a ticket without a deadline", () =>
    testTemplate({ deadline: null }, "Deadline is required!"));
  test("Test - Insert a ticket without a status", () =>
    testTemplate({ status: null }, "Status is required!"));
});

test("Test - Should update a ticket successfully", async () => {
  const newTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const createTicketResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(newTicket);
  expect(createTicketResponse.statusCode).toBe(201);

  const createdTicket = createTicketResponse.body[0];

  const updatedTicket = generateTicket({
    status: "completed",
    user_id: user.id,
    admin_id: admin.id,
  });

  const updateTicketResponse = await supertest(app)
    .put(`${route}/${createdTicket.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .send(updatedTicket);

  expect(updateTicketResponse.statusCode).toBe(200);
  expect(updateTicketResponse.body).toHaveProperty(
    "title",
    updatedTicket.title,
  );
  expect(updateTicketResponse.body).toHaveProperty(
    "description",
    updatedTicket.description,
  );
  expect(updateTicketResponse.body).toHaveProperty(
    "status",
    updatedTicket.status,
  );
  expect(updateTicketResponse.body).toHaveProperty("user_id", user.id);
  expect(updateTicketResponse.body).toHaveProperty("admin_id", admin.id);
});

test("Test - Should delete a ticket by his ID", async () => {
  const existingTicket = generateTicket({
    user_id: user.id,
    admin_id: admin.id,
  });

  const createTicketResponse = await supertest(app)
    .post(route)
    .set("Authorization", `Bearer ${user.token}`)
    .send(existingTicket);
  expect(createTicketResponse.statusCode).toBe(201);

  const createdTicket = createTicketResponse.body[0];

  const deleteTicketResponse = await supertest(app)
    .delete(`${route}/${createdTicket.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(deleteTicketResponse.statusCode).toBe(204);
});
