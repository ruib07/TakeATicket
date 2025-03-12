import supertest from "supertest";
import { generateUser } from "./userFactory.js";
import app from "../../src/app.js";

export const createAndAuthenticateUser = async () => {
  const userRegistration = generateUser();

  const signupResponse = await supertest(app)
    .post("/v1/auth/signup")
    .send(userRegistration);

  if (signupResponse.statusCode !== 201) {
    throw new Error("Failed to create user");
  }

  const createdUser = signupResponse.body;

  const signinResponse = await supertest(app).post("/v1/auth/signin").send({
    email: userRegistration.email,
    password: userRegistration.password,
  });

  if (signinResponse.statusCode !== 200) {
    throw new Error("Failed to authenticate user");
  }

  return { ...createdUser, token: signinResponse.body.token };
};
