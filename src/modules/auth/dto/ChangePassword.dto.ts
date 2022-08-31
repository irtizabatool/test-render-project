import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MinLength,
} from "class-validator";
import {
  EMPTY_FIELD,
  MATCH_PASSWORD,
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  STRING_VALUE,
} from "../../../shared/constants/strings";

export class ChangePasswordDto {
  @IsString({ message: `Old Password ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Old Password ${EMPTY_FIELD}` })
  readonly oldPassword: string;

  @IsString({ message: `New Password ${STRING_VALUE}` })
  @IsNotEmpty({ message: `New Password ${EMPTY_FIELD}` })
  @Matches(PASSWORD_REGEX, {
    message: MATCH_PASSWORD,
  })
  @MinLength(8, {
    message: PASSWORD_LENGTH,
  })
  readonly newPassword: string;
}
