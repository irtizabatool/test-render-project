import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STRING_VALUE, EMPTY_FIELD } from "../../../shared/constants/strings";

export class ResumeSourceAddDto {
  @IsString({ message: `Resume source name ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Resume source name ${EMPTY_FIELD}`})
  sourceName: string;
}
