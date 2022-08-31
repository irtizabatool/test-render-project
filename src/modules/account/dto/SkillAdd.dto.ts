import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { STRING_VALUE, EMPTY_FIELD } from "../../../shared/constants/strings";

export class SkillAddDto {
  @IsString({ message: `Skill name ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Skill name ${EMPTY_FIELD}`})
  skillName: string;
}
