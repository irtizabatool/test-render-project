import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChecksService {
  constructor(private prisma: PrismaService) {}

  async userEmailExists(email: string): Promise<any> {
    const userFound = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userFound) {
      throw new HttpException(
        "User with this email Already exists",
        HttpStatus.BAD_REQUEST
      );
    }
    return;
  }
}
