import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";
import {
  EMPTY_FIELD,
  MATCH_PASSWORD,
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  STRING_VALUE,
} from "../../../shared/constants/strings";

export class InviteAcceptDto {
  @IsString({ message: `Password ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Password ${EMPTY_FIELD}` })
  @Matches(PASSWORD_REGEX, {
    message: MATCH_PASSWORD,
  })
  @MinLength(8, {
    message: PASSWORD_LENGTH,
  })
  readonly password: string;

  @IsString({ message: `Token ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Token ${EMPTY_FIELD}` })
  readonly token: string;
}
