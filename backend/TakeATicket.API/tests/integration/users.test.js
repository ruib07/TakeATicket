import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";
import { createAndAuthenticateUser } from "../utils/testHelpers.js";
import { generateUser } from "../utils/userFactory.js";
import app from "../../src/app.js";

const signupRoute = "/v1/auth/signup";
const route = "/v1/users";

let user;

beforeAll(async () => {
  user = await createAndAuthenticateUser();
});

test("Test #13 - Should return all users", async () => {
  const response = await supertest(app)
    .get(route)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test #14 - Should return a user by his ID", async () => {
  const response = await supertest(app)
    .get(`${route}/${user.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(200);
});

test("Test #15 - Should return not found message when user does not exist", async () => {
  const response = await supertest(app)
    .get(`${route}/${uuidv4()}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(response.statusCode).toBe(404);
  expect(response.body.error).toBe("User not found");
});

test("Test #16 - Should update a user successfully", async () => {
  const existingUser = generateUser();

  const signupResponse = await supertest(app)
    .post(signupRoute)
    .send(existingUser);
  expect(signupResponse.statusCode).toBe(201);

  const createdUser = signupResponse.body;

  const updatedUser = generateUser({
    role: "admin",
  });

  const updateUserResponse = await supertest(app)
    .put(`${route}/${createdUser.id}`)
    .set("Authorization", `Bearer ${user.token}`)
    .send(updatedUser);

  expect(updateUserResponse.statusCode).toBe(200);
  expect(updateUserResponse.body).toHaveProperty("name", updatedUser.name);
  expect(updateUserResponse.body).toHaveProperty("email", updatedUser.email);
  expect(updateUserResponse.body).toHaveProperty("role", updatedUser.role);
});

test("Test #17 - Should delete a user by his ID", async () => {
  const existingUser = generateUser();

  const signupResponse = await supertest(app)
    .post(signupRoute)
    .send(existingUser);
  expect(signupResponse.statusCode).toBe(201);

  const createdUser = signupResponse.body;

  const deleteUserResponse = await supertest(app)
    .delete(`${route}/${createdUser.id}`)
    .set("Authorization", `Bearer ${user.token}`);

  expect(deleteUserResponse.statusCode).toBe(204);
});
