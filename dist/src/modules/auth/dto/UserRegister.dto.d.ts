import { RoleType } from "@prisma/client";
export declare class UserRegisterDto {
    email: string;
    firstName: string;
    lastName: string;
    companyName: string;
    password: string;
    role: RoleType;
}
