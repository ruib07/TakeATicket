import { IUser } from "../@types/user";
import apiRequest from "./helpers/api.service";

export const GetUsers = async () => apiRequest("GET", "users", undefined, true);

export const GetUserById = async (userId: string) =>
  apiRequest("GET", `users/${userId}`, undefined, true);

export const GetUsersByRole = async (role: string) =>
  apiRequest("GET", `users/byrole/${role}`, undefined, true);

export const UpdateUser = async (userId: string, updateUser: Partial<IUser>) =>
  apiRequest("PUT", `users/${userId}`, updateUser, true);

export const DeleteUser = async (userId: string) =>
  apiRequest("DELETE", `users/${userId}`, undefined, true);
