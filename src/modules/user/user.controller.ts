import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { RoleType, User } from "@prisma/client";

import { UserService } from "./user.service";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { AuthUser } from "src/decorators/auth.user.decorator";
import { ResponseSuccess } from "src/common/dto/ResponseSuccess.dto";
import { UserInviteDto } from "./dto/UserInvite.dto";
import { UserDto } from "../auth/dto/User.dto";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async getAll(): Promise<User[]> {
    return this.userService.users();
  }

  @Post("create")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async signupUser(@Body() userData: UserRegisterDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post('invite')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async inviteUser(@Body() userInviteDto: UserInviteDto): Promise<ResponseSuccess> {
    const userInvited = await this.userService.inviteUser(userInviteDto);
    return new ResponseSuccess(
      `User Invited Successfully`,
      new UserDto(userInvited)
    );
  }

  @Post("logout")
  @UseGuards(AuthGuard, RolesGuard)
  async logout(@AuthUser() user: User): Promise<ResponseSuccess> {
    const status = await this.userService.logout(user);
    return new ResponseSuccess(`Successfully Logged Out`, status);
  }
}
