import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { UserRegisterDto } from './dto/UserRegister.dto';
import { UserLoginDto } from './dto/UserLogin.dto';
import { AuthResponseDTO } from './dto/AuthResponse.dto';
import { ForgotPasswordDto } from './dto/ForgotPassword.dto';
import { ResetPasswordDto } from './dto/ResetPassword.dto';
import { EmailService } from '../email/email.service';
export declare class AuthService {
    private userService;
    private prisma;
    private jwtService;
    private emailService;
    constructor(userService: UserService, prisma: PrismaService, jwtService: JwtService, emailService: EmailService);
    login(userLoginDto: UserLoginDto): Promise<AuthResponseDTO>;
    register(user: UserRegisterDto): Promise<AuthResponseDTO>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<boolean>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean>;
}
