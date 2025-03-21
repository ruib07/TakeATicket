import supertest from "supertest";

const request = supertest("http://localhost:3005");

test("Test - Validate if the server responds on port 3005", () => {
  request.get("/").then((res) => {
    expect(res.status).toBe(200);
  });
});
