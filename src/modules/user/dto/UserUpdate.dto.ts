import { IsOptional, IsString } from "class-validator";
import { STRING_VALUE } from "../../../shared/constants/strings";

export class UserUpdateDto {
  @IsString({ message: `First name ${STRING_VALUE}` })
  @IsOptional()
  firstName: string;

  @IsString({ message: `Last name ${STRING_VALUE}` })
  @IsOptional()
  lastName: string;

  @IsString({ message: `Profile picture URL ${STRING_VALUE}` })
  @IsOptional()
  profilePicture: string;
}
