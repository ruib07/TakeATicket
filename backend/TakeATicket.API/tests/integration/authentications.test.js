import supertest from "supertest";
import { generateUser } from "../utils/userFactory.js";
import app from "../../src/app.js";

const signinRoute = "/v1/auth/signin";
const signupRoute = "/v1/auth/signup";
const userByIdRoute = "/v1/users";

test("Test #3 - Should create a user successfully", async () => {
  const user = generateUser();

  const res = await supertest(app).post(signupRoute).send(user);
  expect(res.statusCode).toBe(201);
});

test("Test #4 - Should return a token when user authenticates successfully", async () => {
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

test("Test #5 - Should fail authentication with invalid credentials", async () => {
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

test("Test #6 - Should deny access to a protected route without authentication", async () => {
  const response = await supertest(app).get(userByIdRoute);
  expect(response.statusCode).toBe(401);
});

test("Test #7 - Should allow access to a protected route with valid token", async () => {
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
