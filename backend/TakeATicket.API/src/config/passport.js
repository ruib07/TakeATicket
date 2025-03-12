import passport from "passport";
import passportJwt from "passport-jwt";
import { usersService } from "../services/users.service.js";

const secret = "userTakeATicket@2025";

const { Strategy, ExtractJwt } = passportJwt;

export const passportConfig = (app) => {
  const service = usersService(app);

  const params = {
    secretOrKey: secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  const strategy = new Strategy(params, (payload, done) => {
    service
      .find({ id: payload.id })
      .then((user) => {
        if (user) {
          done(null, { ...payload });
        } else {
          done(null, false);
        }
      })
      .catch((error) => done(error, false));
  });

  passport.use("jwt", strategy);

  return {
    authenticate: () => passport.authenticate("jwt", { session: false }),
  };
};
