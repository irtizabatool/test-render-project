import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { STRING_VALUE, EMPTY_FIELD } from '../../../shared/constants/strings';

export class SkillEditDto {
  @IsUUID(4, {
    message: `Id should be a valid uuid`,
  })
  @IsString({ message: `Skill Id ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Skill Id ${EMPTY_FIELD}` })
  readonly id: string;

  @IsString({ message: `Skill name ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Skill name ${EMPTY_FIELD}` })
  skillName: string;
}
