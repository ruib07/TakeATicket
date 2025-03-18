import { IChangePassword } from "../@types/changePassword";
import apiRequest from "./helper/api.service";

export const ChangePassword = async (changePassword: IChangePassword) =>
  apiRequest("PUT", "reset-password/change-password", changePassword);
