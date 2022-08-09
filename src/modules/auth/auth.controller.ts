import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto/UserRegister.dto";
import { UserLoginDto } from "./dto/UserLogin.dto";
import { ForgotPasswordDto } from "./dto/ForgotPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";
import { CheckLinkDto } from "./dto/CheckLink.dto";
import { AuthResponseDTO } from "./dto/AuthResponse.dto";
import { UserDto } from "./dto/User.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() userLoginDto: UserLoginDto): Promise<ResponseSuccess> {
    const userData = await this.authService.login(userLoginDto);
    const token = await this.authService.createToken(userData);
    return new ResponseSuccess(`User info with access token`, new AuthResponseDTO(new UserDto(userData), token));
  }

  @Post("register")
  async register(@Body() UserRegisterDto: UserRegisterDto): Promise<ResponseSuccess> {
    const createdUser = await this.authService.register(UserRegisterDto);
    const token = await this.authService.createToken(createdUser);
    return new ResponseSuccess(`User info with access token`, new AuthResponseDTO(new UserDto(createdUser), token));
  }

  @Post("forgot-password")
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto
  ): Promise<ResponseSuccess> {
    const linkSent = await this.authService.forgotPassword(forgotPasswordDto);
    return new ResponseSuccess(
      `Forgot Password Link Sent Successfully`,
      linkSent
    );
  }

  @Post("reset-password")
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto
  ): Promise<ResponseSuccess> {
    const passwordChanged = await this.authService.resetPassword(
      resetPasswordDto
    );
    return new ResponseSuccess(
      `Changed Password Successfully`,
      passwordChanged
    );
  }

  @Post('check-link')
  async checkLinkExpiry(
    @Body() checkLinkDto: CheckLinkDto
  ): Promise<ResponseSuccess> {
    const linkCheck = await this.authService.checkLinkExpiry(checkLinkDto);
    return new ResponseSuccess(
      'The link is Valid',
      linkCheck
    );
  }
}
