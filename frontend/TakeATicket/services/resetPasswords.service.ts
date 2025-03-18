import { ISendEmail } from "@/@types/resetPassword";
import apiRequest from "./helpers/api.service";

export const SendEmail = async (sendEmail: ISendEmail) =>
  apiRequest("POST", "reset-password/send-email", sendEmail, false);
