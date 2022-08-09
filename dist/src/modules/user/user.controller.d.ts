import { User } from "@prisma/client";
import { UserService } from "./user.service";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAll(): Promise<User[]>;
    signupUser(userData: UserRegisterDto): Promise<User>;
    logout(user: User): Promise<ResponseSuccess>;
}
