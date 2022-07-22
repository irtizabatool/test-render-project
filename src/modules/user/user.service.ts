import { HttpException, HttpStatus, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
import { AuthHelpers } from "src/shared/helpers/auth.helpers";
import { UserRegisterDto } from "../auth/dto/UserRegister.dto";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

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
    const salt = await genSalt(10);
    userRegisterDto.password = await hash(userRegisterDto.password, salt);
    
    const userFound = await this.prisma.user.findFirst({
      where: { email },
    });

    if (userFound) {
      throw new HttpException("User Already Exists", HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.create({
      data: userRegisterDto,
    });
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
