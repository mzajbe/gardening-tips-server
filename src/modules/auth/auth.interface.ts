import { USER_ROLE } from "../user/user.constant";

export type TLoginUsr = {
    email: string;
    password: string;
};

export type TSignupUser = {
    name: string;
    email: string;
    // mobileNumber: string;
    password: string;
    role: keyof typeof USER_ROLE;
  };