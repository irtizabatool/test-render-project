import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import {
  EMPTY_FIELD,
  INVALID_EMAIL,
  STRING_VALUE,
} from "../../../shared/constants/strings";

export class ForgotPasswordDto {
  @IsString({ message: `Email ${STRING_VALUE}` })
  @IsEmail({}, { message: INVALID_EMAIL })
  @IsNotEmpty({
    message: `Email ${EMPTY_FIELD}`,
  })
  public email: string;
}
