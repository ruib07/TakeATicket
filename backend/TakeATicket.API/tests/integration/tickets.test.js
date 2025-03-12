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

test("Test #13 - Should return all tickets", async () => {
  const response = await supertest(app)
    .get(route)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test #14 - Should return a ticket by his ID", async () => {
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

test("Test #15 - Should return not found message when ticket does not exist", async () => {
  const response = await supertest(app)
    .get(`${route}/${uuidv4()}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(404);
  expect(response.body.error).toBe("Ticket not found");
});

test("Test #16 - Should return ticket when admin is valid", async () => {
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

test("Test #17 - Should return ticket when user is valid", async () => {
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

test("Test #18 - Should create a new ticket successfully", async () => {
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

test("Test #19 - Should update a ticket successfully", async () => {
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

test("Test #20 - Should delete a ticket by his ID", async () => {
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
