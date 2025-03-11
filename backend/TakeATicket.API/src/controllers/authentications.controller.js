import jwtsimple from 'jwt-simple';
import bcrypt from 'bcrypt';
import { usersService } from '../services/users.service.js';
const secret = 'userTakeATicket@2025';

export const authController = (app) => {
  const userFromDb = usersService(app);

  const signin = (req, res, next) => {
    userFromDb.find({
      email: req.body.email,
    })
      .then((user) => {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };

          const token = jwtsimple.encode(payload, secret);
          res.status(200).json({ token, user: payload });
        } else {
          res.status(400).json({ error: 'Invalid authentication!' });
        }
      })
      .catch((error) => next(error));
  };

  const signup = async (req, res, next) => {
    try {
      const result = await userFromDb.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };

  return {
    signin,
    signup,
  };
}
