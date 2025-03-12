import { v4 as uuidv4 } from "uuid";

export const generateUser = (overrides = {}) => ({
  name: "name" in overrides ? overrides.name : `User-${uuidv4().slice(0, 6)}`,
  email: "email" in overrides ? overrides.email : `${uuidv4()}@email.com`,
  password: "password" in overrides ? overrides.password : "User@Auth-123",
  role: "role" in overrides ? overrides.role : "user",
});
