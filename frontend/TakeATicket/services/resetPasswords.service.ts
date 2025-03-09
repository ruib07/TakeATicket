import { IChangePassword, ISendEmail } from "@/@types/resetPassword";
import apiRequest from "./helpers/api.service";

export const SendEmail = async (sendEmail: ISendEmail) =>
  apiRequest("POST", "send-email", sendEmail, false);

export const ChangePassword = async (changePassword: IChangePassword) =>
  apiRequest("PUT", "change-password", changePassword, false);
