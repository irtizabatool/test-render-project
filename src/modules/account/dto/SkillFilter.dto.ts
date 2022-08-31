import { IsOptional, IsString } from "class-validator";
import { STRING_VALUE } from "../../../shared/constants/strings";

export class SkillFilterDto {
    @IsString({ message: `Skill name ${STRING_VALUE}` })
    @IsOptional()
    skillName: string;
}