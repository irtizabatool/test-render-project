import { Prisma, User } from "@prisma/client";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { PrismaService } from "../prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findUser(email: string): Promise<User | null>;
    users(): Promise<User[]>;
    createUser(userRegisterDto: UserRegisterDto): Promise<User>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User>;
    logout(user: User): Promise<boolean>;
}
