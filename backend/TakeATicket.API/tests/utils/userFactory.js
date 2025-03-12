import { v4 as uuidv4 } from "uuid";

export const generateUser = (overrides = {}) => ({
  name: overrides.name || `User-${uuidv4().slice(0, 6)}`,
  email: overrides.email || `${uuidv4()}@email.com`,
  password: overrides.password || "User@Auth-123",
  role: overrides.role || "user",
});
