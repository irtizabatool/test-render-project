import { RoleType, User, UserStatus } from "@prisma/client";

export class UserDto {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    role: RoleType;

    status: UserStatus;

    companyName: string;

    aboutCompany: string;

    createdAt: Date;

    updatedAt: Date;

    constructor(user: User) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
        this.status = user.status;
        this.companyName = user.companyName;
        this.aboutCompany = user.aboutCompany;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt
    }
}