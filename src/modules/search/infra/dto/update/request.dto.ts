import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';

class UpdateQuestionDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  name: string;
}

export class UpdateSearchRequestDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  targetAudience?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestionDto)
  questions?: UpdateQuestionDto[];
}
