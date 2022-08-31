import { IsBoolean, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { EMPTY_FIELD, STRING_VALUE } from "../../../shared/constants/strings";

export class CheckUserStatusDto {
  @IsUUID(4, {
    message: `Id should be a valid uuid`
  })
  @IsString({ message: `User Id ${STRING_VALUE}` })
  @IsNotEmpty({ message: `User Id ${EMPTY_FIELD}` })
  readonly id: string;

  @IsBoolean({ message: `Login Access` })
  @IsNotEmpty({ message: `Login Access ${EMPTY_FIELD}` })
  readonly loginAccess: boolean;
}
