import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto/UserRegister.dto";
import { UserLoginDto } from "./dto/UserLogin.dto";
import { ForgotPasswordDto } from "./dto/ForgotPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(user: UserLoginDto): Promise<ResponseSuccess>;
    register(user: UserRegisterDto): Promise<ResponseSuccess>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<ResponseSuccess>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<ResponseSuccess>;
}
