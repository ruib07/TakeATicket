import supertest from "supertest";
import { generateUser } from "../utils/userFactory.js";
import app from "../../src/app.js";

const signinRoute = "/v1/auth/signin";
const signupRoute = "/v1/auth/signup";
const userByIdRoute = "/v1/users";

test("Test - Should create a user successfully", async () => {
  const user = generateUser();

  const response = await supertest(app).post(signupRoute).send(user);
  expect(response.statusCode).toBe(201);
});

describe("User creation validation", () => {
  const testTemplate = async (newData, errorMessage) => {
    const user = generateUser({
      ...newData,
    });

    const response = await supertest(app).post(signupRoute).send(user);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(errorMessage);
  };

  test("Test - Insert a user without a name", () =>
    testTemplate({ name: null }, "Name is required!"));
  test("Test - Insert a user without a email", () =>
    testTemplate({ email: null }, "Email is required!"));
  test("Test - Insert a user without password", () =>
    testTemplate({ password: null }, "Password is required!"));
  test("Test - Insert a user without role", () =>
    testTemplate({ role: null }, "Role is required!"));
  test("Test - Insert a user with an invalid password", () =>
    testTemplate(
      { password: "weakpass" },
      "Password does not meet the requirements!",
    ));
});

test("Test - Should return a token when user authenticates successfully", async () => {
  const user = generateUser();

  const signupResponse = await supertest(app).post(signupRoute).send(user);
  expect(signupResponse.statusCode).toBe(201);

  const signinResponse = await supertest(app).post(signinRoute).send({
    email: user.email,
    password: user.password,
  });

  expect(signinResponse.statusCode).toBe(200);
  expect(signinResponse.body).toHaveProperty("token");
  expect(signinResponse.body).toHaveProperty("user");
});

test("Test - Should fail authentication with invalid credentials", async () => {
  const user = generateUser();

  const signupResponse = await supertest(app).post(signupRoute).send(user);
  expect(signupResponse.statusCode).toBe(201);

  const signinResponse = await supertest(app).post(signinRoute).send({
    email: user.email,
    password: "invalid-password",
  });

  expect(signinResponse.statusCode).toBe(400);
  expect(signinResponse.body.error).toBe("Invalid authentication!");
});

test("Test - Should deny access to a protected route without authentication", async () => {
  const response = await supertest(app).get(userByIdRoute);
  expect(response.statusCode).toBe(401);
});

test("Test - Should allow access to a protected route with valid token", async () => {
  const user = generateUser();

  const signupResponse = await supertest(app).post(signupRoute).send(user);
  expect(signupResponse.statusCode).toBe(201);

  const signinResponse = await supertest(app).post(signinRoute).send({
    email: user.email,
    password: user.password,
  });

  expect(signinResponse.statusCode).toBe(200);
  expect(signinResponse.body).toHaveProperty("token");
  expect(signinResponse.body).toHaveProperty("user");

  const token = signinResponse.body.token;
  const response = await supertest(app)
    .get(userByIdRoute)
    .set("Authorization", `Bearer ${token}`);

  expect(response.statusCode).toBe(200);
});
