import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RoleType, User } from "@prisma/client";

import { UserService } from "./user.service";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { AuthUser } from "src/decorators/auth.user.decorator";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";

@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async getAll(): Promise<User[]> {
    return this.userService.users();
  }

  @Post("create")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  async signupUser(@Body() userData: UserRegisterDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post("logout")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN, RoleType.USER)
  async logout(@AuthUser() user: User): Promise<ResponseSuccess> {
    const status = await this.userService.logout(user);
    return new ResponseSuccess(`Successfully Logged Out`, status);
  }
}
