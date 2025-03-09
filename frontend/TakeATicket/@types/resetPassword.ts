export interface ISendEmail {
  email: string;
}

export interface IChangePassword {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
