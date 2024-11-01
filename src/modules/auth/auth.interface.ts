import { USER_ROLE } from "../user/user.constant";

export type TLoginUsr = {
    email: string;
    password: string;
};

export type TSignUpUser = {
    name:string;
    email:string;
    password:string;
    profilePicture:string;
    role:keyof typeof USER_ROLE;
}

