import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { UserRegisterDto } from "./dto/UserRegister.dto";
import { UserLoginDto } from "./dto/UserLogin.dto";
import { ForgotPasswordDto } from "./dto/ForgotPassword.dto";
import { ResetPasswordDto } from "./dto/ResetPassword.dto";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(@Body() user: UserLoginDto): Promise<ResponseSuccess> {
    const userData = await this.authService.login(user);
    return new ResponseSuccess(`User info with access token`, userData);
  }

  @Post("register")
  async register(@Body() user: UserRegisterDto): Promise<ResponseSuccess> {
    const createdUser = await this.authService.register(user);
    return new ResponseSuccess(`Successfully Registered.`, createdUser);
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
}
