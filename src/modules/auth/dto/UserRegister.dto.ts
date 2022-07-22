import { RoleType } from "@prisma/client";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from "class-validator";
import {
  EMPTY_FIELD,
  INVALID_EMAIL,
  MATCH_PASSWORD,
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  STRING_VALUE,
} from "../../../shared/constants/strings";

export class UserRegisterDto {
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

  @IsString({ message: `Company name ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Company name ${EMPTY_FIELD}`,
  })
  companyName: string;

  @IsString({ message: `Password ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Password ${EMPTY_FIELD}`,
  })
  @Matches(PASSWORD_REGEX, {
    message: MATCH_PASSWORD,
  })
  @MinLength(8, {
    message: PASSWORD_LENGTH,
  })
  password: string;

  @IsString({ message: `Role ${STRING_VALUE}` })
  @IsNotEmpty({
    message: `Role ${EMPTY_FIELD}`,
  })
  role: RoleType;
}
