import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { RoleType, User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChecksService {
  constructor(private prisma: PrismaService) {}

  async checkForSuperAdmin(role: RoleType) {
    if(role === RoleType.SUPER_ADMIN) {
      throw new HttpException("User Cannot be a Super Admin", HttpStatus.BAD_REQUEST);
    }
  }

  async userEmailExists(email: string): Promise<any> {
    const userFound = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userFound) {
      throw new HttpException(
        "User with this email already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    return;
  }

  async findUserById(id: string): Promise<User> {
    try {
      const userFound = await this.prisma.user.findUnique({
        where: { id },
        include: {
          organisation: true
        }
      });
      return userFound;
    } catch (e) {
      throw new NotFoundException('User with this Id was not found');
    }
  }
}
