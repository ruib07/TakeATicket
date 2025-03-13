import express from "express";
import cors from "cors";
import knex from "knex";
import knexfile from "../knexfile.js";
import { NODE_ENV } from "./config.js";
import { setupRoutes } from "./config/router.js";
import { middleware } from "./config/middleware.js";

const app = express();

app.use(express.json());

app.db = knex(knexfile[NODE_ENV]);

const allowedOrigins = [process.env.WEB_ORIGIN, process.env.EXPO_ORIGIN];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  }),
);

middleware(app);
setupRoutes(app);

app.get("/", (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === "validationError") res.status(400).json({ error: message });
  else res.status(500).json({ name, message, stack });
  next(err);
});

export const listen = (port, callback) => {
  app.listen(port, callback);
};

export default app;
