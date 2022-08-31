import { IsOptional, IsString } from "class-validator";
import { STRING_VALUE } from "../../../shared/constants/strings";

export class SourceFilterDto {
    @IsString({ message: `Resume source name ${STRING_VALUE}` })
    @IsOptional()
    sourceName: string;
}