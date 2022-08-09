import { RoleType } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
} from "class-validator";
import {
  EMPTY_FIELD,
  INVALID_EMAIL,
  STRING_VALUE,
} from "../../../shared/constants/strings";

export class UserInviteDto {
  @IsString({ message: `Email ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Email ${EMPTY_FIELD}`,
  })
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString({ message: `First name ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `First name ${EMPTY_FIELD}`,
  })
  firstName: string;

  @IsString({ message: `Last name ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Last name ${EMPTY_FIELD}`,
  })
  lastName: string;

  @IsString({ message: `Role ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Role ${EMPTY_FIELD}`,
  })
  role: RoleType;
}
