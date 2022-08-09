import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Prisma, RoleType, User } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { randomUUID } from "crypto";
import { JWT_SECRET } from "src/shared/constants/global.constants";
import { AuthHelpers } from "src/shared/helpers/auth.helpers";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";
import { EmailService } from "../email/email.service";

import { PrismaService } from "../prisma/prisma.service";
import { ChecksService } from "./checks.service";
import { UserInviteDto } from "./dto/UserInvite.dto";
import * as jwt from 'jsonwebtoken';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private checksService: ChecksService,
    private emailService: EmailService,
  ) {}

  async findUser(email: string): Promise<User | null> {
    try {
      const userFound = await this.prisma.user.findUnique({
        where: { email },
      });
      return userFound;
    } catch (e) {
      throw new UnauthorizedException('User with this Email or Password was not found');
    }
  }

  async users(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    users.forEach((users) => {
      users.password = null;
    });
    return users;
  }

  async createUser(userRegisterDto: UserRegisterDto): Promise<User> {
    const { email, password } = userRegisterDto;
    await this.checksService.userEmailExists(email);
    const salt = await genSalt(10);
    userRegisterDto.password = await hash(userRegisterDto.password, salt);

    const user = await this.prisma.user.create({
      data: userRegisterDto,
    });
    return user;
  }

  async inviteUser(userInviteDto: UserInviteDto): Promise<User> {
    if(userInviteDto.role === RoleType.SUPER_ADMIN) {
      throw new HttpException("User Cannot be a Super Admin", HttpStatus.BAD_REQUEST);
    }
    await this.checksService.userEmailExists(userInviteDto.email);

    let password = randomUUID()
    const salt = await genSalt(10);
    password = await hash(password, salt);
    
    const user = await this.prisma.user.create({
      data: {
        ...userInviteDto,
        password
      }
    });
  
    const secret = JWT_SECRET + user.password;

    const payload  = {
      email: user.email,
      userId: user.id,
    }

    const token =  jwt.sign(payload, secret, {
      expiresIn: '24h'    
    });

    const invitationLinkUrl = `${process.env.FRONTEND_URL_JOIN}/${user.id}/${token}`;
    Logger.log(invitationLinkUrl)
    
    this.emailService.sendEmail(
      user.email,
      [],
      [],
      'Crownstack ATS Invitation',
      './reset-password',
      {
        firstName: user.firstName,
        link: invitationLinkUrl
      }
    );
    return user;
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  public async logout(user: User): Promise<boolean> {
    Logger.log(`${user.email} logging out`);
    //TODO: Once we will have  fcmtokens for push notifications we will delete current fcmtoken wwhile logging out
    return true;
  }
}
