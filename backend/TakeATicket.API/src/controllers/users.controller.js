import { usersService } from "../services/users.service.js";

export const usersController = (app) => {
  const userFromDb = usersService(app);

  const getAllUsers = async (req, res, next) => {
    try {
      const users = await userFromDb.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return next(error);
    }
  };

  const getUserById = async (req, res, next) => {
    try {
      const user = await userFromDb.find({ id: req.params.id });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return next(error);
    }
  };

  const updateUser = async (req, res, next) => {
    try {
      const updatedUserInfo = req.body;
      const result = await userFromDb.update(req.params.id, updatedUserInfo);
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  };

  const deleteUser = async (req, res, next) => {
    try {
      await userFromDb.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  };

  return {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };
};
