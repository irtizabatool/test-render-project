import { RoleType, UserStatus } from "@prisma/client";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { INVALID_EMAIL, STRING_VALUE } from "../../../shared/constants/strings";

export class UserFilterDto {
  @IsString({ message: `Email ${STRING_VALUE}` })
  @IsOptional()
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString({ message: `First Name ${STRING_VALUE}` })
  @IsOptional()
  firstName: string;

  @IsString({ message: `Last Name ${STRING_VALUE}` })
  @IsOptional()
  lastName: string;

  @IsString({ message: `Role ${STRING_VALUE}` })
  @IsOptional()
  role: RoleType;

  @IsString({ message: `User Status ${STRING_VALUE}` })
  @IsOptional()
  status: UserStatus;
}
