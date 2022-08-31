import { IsOptional, IsString } from "class-validator";
import { STRING_VALUE } from "src/shared/constants/strings";

export class CompanyUpdateDto {
  @IsString({ message: `Company name ${STRING_VALUE}` })
  @IsOptional()
  companyName: string;

  @IsString({ message: `Company Description ${STRING_VALUE}` })
  @IsOptional()
  companyDescription: string;
}
