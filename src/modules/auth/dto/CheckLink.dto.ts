import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { EMPTY_FIELD, STRING_VALUE } from "src/shared/constants/strings";

export class CheckLinkDto {
  @IsUUID(4, {
    message: `Id should be a valid uuid`
  })
  @IsString({ message: `User Id ${STRING_VALUE}` })
  @IsNotEmpty({ message: `User Id ${EMPTY_FIELD}` })
  readonly id: string;

  @IsString({ message: `Token ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Token ${EMPTY_FIELD}` })
  readonly token: string;
}
