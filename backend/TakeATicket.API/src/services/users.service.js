import bcrypt from "bcrypt";
import ValidationError from "../errors/validationError.js";

export const usersService = (app) => {
  const findAll = (filter = {}) => app.db("users").where(filter);

  const find = (filter = {}) => app.db("users").where(filter).first();

  const getPasswordHash = (pass) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
  };

  const validatePassword = (password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const isLengthValid = password.length >= 9;

    return (
      hasLowercase &&
      hasUppercase &&
      hasDigit &&
      hasSpecialChar &&
      isLengthValid
    );
  };

  const save = async (newUser) => {
    if (!newUser.name) throw new ValidationError("Name is required!");
    if (!newUser.email) throw new ValidationError("Email is required!");
    if (!newUser.password) throw new ValidationError("Password is required!");
    if (!newUser.role) throw new ValidationError("Role is required!");

    if (!validatePassword(newUser.password)) {
      throw new ValidationError("Password does not meet the requirements!");
    }

    const existingEmail = await find({ email: newUser.email });
    if (existingEmail) {
      throw new ValidationError("Email already exists!");
    }

    const hashedPassword = getPasswordHash(newUser.password);
    const userWithHashedPassword = { ...newUser, password: hashedPassword };

    return app.db("users").insert(userWithHashedPassword, "*");
  };

  const update = async (id, userRes) => {
    if (userRes.password && !validatePassword(userRes.password)) {
      throw new ValidationError("Password does not meet the requirements!");
    }

    const updatedUserInfo = { ...userRes };

    if (userRes.password) {
      updatedUserInfo.password = getPasswordHash(userRes.password);
    }

    return app.db("users").where({ id }).update(updatedUserInfo, "*");
  };

  const remove = (id) => app.db("users").where({ id }).del();

  return {
    findAll,
    find,
    save,
    update,
    remove,
  };
};
