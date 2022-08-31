import { Organisation, RoleType, User, UserStatus } from "@prisma/client";

export class UserDto {
    id: string;

    email: string;

    firstName: string;

    lastName: string;

    role: RoleType;

    status: UserStatus;

    createdAt: Date;

    updatedAt: Date;
    
    organisation: Organisation;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
        this.status = user.status;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.organisation = user.organisation? user.organisation : null;
    }
}