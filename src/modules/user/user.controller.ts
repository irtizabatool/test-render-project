import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { RoleType, User } from "@prisma/client";

import { UserService } from "./user.service";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../decorators/roles.decorator";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { AuthUser } from "../../decorators/auth.user.decorator";
import { ResponseSuccess } from "../../common/dto/ResponseSuccess.dto";
import { UserInviteDto } from "./dto/UserInvite.dto";
import { PageOptionsDto } from "../../common/dto/PaginationDto";
import { UserFilterDto } from "./dto/UserFilter.dto";
import { CheckUserStatusDto } from "./dto/ChangeUserStatus.dto";
import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { UserUpdateDto } from "./dto/UserUpdate.dto";
import { AccessGuard } from "../../guards/access.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { IFile } from "../../interfaces/IFile";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("team")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async getAll(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: PageOptionsDto,
    @Body() filterData: UserFilterDto,
    @Query("searchQuery") searchQuery: string
  ): Promise<ResponseSuccess> {
    const teamMembers = await this.userService.users(
      filterData,
      searchQuery,
      pageOptionsDto
    );
    return new ResponseSuccess(`Team Member List`, teamMembers);
  }

  @Post("create")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async signupUser(@Body() userData: UserRegisterDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Post("invite")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async inviteUser(
    @AuthUser() currentUser: User,
    @Body() userInviteDto: UserInviteDto
  ): Promise<ResponseSuccess> {
    const userInvited = await this.userService.inviteUser(userInviteDto, currentUser);
    return new ResponseSuccess(
      `Invite send successfully`,
      userInvited
    );
  }

  @Put("resend-invite/:userId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async resendInvite(
    @Param('userId', UUIDCheckPipe) userId: string,
  ): Promise<ResponseSuccess> {
    const userInvited = await this.userService.resendInvite(userId);
    return new ResponseSuccess(
      `Invite send successfully`,
      userInvited
    );
  }

  @Post("change-status")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async changeUserStatus(
    @Body() checkUserStatusDto: CheckUserStatusDto
  ): Promise<ResponseSuccess> {
    const updatedUser = await this.userService.changeUserStatus(
      checkUserStatusDto
    );
    return new ResponseSuccess(`User has been ${updatedUser}`);
  }

  @Put('update')
  @UseGuards(AuthGuard, AccessGuard)
  async updateUser(
    @AuthUser() user: User,
    @Body() updateDetails: UserUpdateDto,    
  ): Promise<ResponseSuccess> {
    const status = await this.userService.updateUser(
      updateDetails,
      user,
    );
    return new ResponseSuccess(`Your profile has been updated successfully`,
      status,
    );
  }

  @Post('upload/image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1e7, // Limit payload size to 10 MB
      },
    }),
  )
  async imageUpload(@UploadedFile() file: IFile): Promise<any> {
    const upload = await this.userService.uploadDOFile(file);
    return new ResponseSuccess(`Uploaded file successfully`, upload);
  }

  @Post("logout")
  @UseGuards(AuthGuard, RolesGuard)
  async logout(@AuthUser() user: User): Promise<ResponseSuccess> {
    const status = await this.userService.logout(user);
    return new ResponseSuccess(`Successfully Logged Out`, status);
  }
}
