import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { STRING_VALUE, EMPTY_FIELD } from '../../../shared/constants/strings';

export class ResumeSourceEditDto {
  @IsUUID(4, {
    message: `Id should be a valid uuid`,
  })
  @IsString({ message: `Resume source Id ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Resume source Id ${EMPTY_FIELD}` })
  readonly id: string;

  @IsString({ message: `Resume source name ${STRING_VALUE}` })
  @IsNotEmpty({ message: `Resume source name ${EMPTY_FIELD}` })
  sourceName: string;
}
