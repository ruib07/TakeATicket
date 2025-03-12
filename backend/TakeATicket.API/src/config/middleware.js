import bodyparser from "body-parser";

export const middleware = (app) => {
  app.use(bodyparser.json());
};
