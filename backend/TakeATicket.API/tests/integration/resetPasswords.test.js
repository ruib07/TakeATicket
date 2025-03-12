import supertest from "supertest";
import app from "../../src/app.js";
import { generateUser } from "../utils/userFactory.js";
import { generateChangePassword } from "../utils/resetPasswordFactory.js";

const route = "/v1/reset-password";
const sendEmailRoute = "send-email";
const changePasswordRoute = "change-password";

let user;

beforeAll(async () => {
  const newUser = generateUser();

  const signupResponse = await supertest(app)
    .post("/v1/auth/signup")
    .send(newUser);

  user = signupResponse.body;
});

test("Test #27 - Should send a email to reset password when user exists", async () => {
  const response = await supertest(app)
    .post(`${route}/${sendEmailRoute}`)
    .send({
      email: user.email,
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Email sent successfully");
});

test("Test #28 - Should return success even if the user does not exist", async () => {
  const response = await supertest(app)
    .post(`${route}/${sendEmailRoute}`)
    .send({
      email: "nonexistentuser@example.com",
    });

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Email sent successfully");
});

test("Test #28 - Should change password when user put valid credentials", async () => {
  const validToken = "validtoken456";

  await app.db("resetpasswordtokens").insert({
    token: validToken,
    expirydate: new Date(Date.now() + 3600000),
    user_id: user.id,
  });

  const changePassword = generateChangePassword();

  const response = await supertest(app)
    .put(`${route}/${changePasswordRoute}`)
    .send(changePassword);

  expect(response.statusCode).toBe(200);
  expect(response.body.message).toBe("Password changed successfully");
});

test("Test #29 - Should return error message when passwords are mismatched", async () => {
  const validToken = "validtoken123";

  await app.db("resetpasswordtokens").insert({
    token: validToken,
    expirydate: new Date(Date.now() + 3600000),
    user_id: user.id,
  });

  const changePassword = generateChangePassword({
    confirmNewPassword: "Invalid@Password-12",
  });

  const response = await supertest(app)
    .put(`${route}/${changePasswordRoute}`)
    .send(changePassword);

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Passwords do not match");
});

test("Test #30 - Should return error message when token is expired", async () => {
  const expiredToken = "expiredtoken123";

  await app.db("resetpasswordtokens").insert({
    token: expiredToken,
    expirydate: new Date(Date.now() - 3600000),
    user_id: user.id,
  });

  const changePassword = generateChangePassword();

  const response = await supertest(app)
    .put(`${route}/${changePasswordRoute}`)
    .send(changePassword);

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Invalid or expired token");
});

test("Test #31 - Should return error message when token is invalid", async () => {
  const changePassword = generateChangePassword();

  const response = await supertest(app)
    .put(`${route}/${changePasswordRoute}`)
    .send(changePassword);

  expect(response.statusCode).toBe(400);
  expect(response.body.error).toBe("Invalid or expired token");
});
