import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { EMPTY_FIELD, INVALID_EMAIL } from "../../../shared/constants/strings";

export class UserLoginDto {
  @IsString()
  @IsNotEmpty({ message: INVALID_EMAIL })
  @IsEmail({}, { message: INVALID_EMAIL })
  email: string;

  @IsString()
  @IsNotEmpty({ message: `Password ${EMPTY_FIELD}` })
  password: string;
}
