import supertest from "supertest";

import app from "../../src/app.js";

test("Test #1 - Test if it is resolving at the root", async () => {
  const response = await supertest(app).get("/");

  expect(response.statusCode).toBe(200);
});
