import { ISignup, ISignin } from "../@types/authentication";
import apiRequest from "./helpers/api.service";

export const Signup = async (newAdmin: ISignup) =>
  apiRequest("POST", "auth/signup", newAdmin, false);

export const Signin = async (signin: ISignin) =>
  apiRequest("POST", "auth/signin", signin, false);
