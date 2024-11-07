import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsArray,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsInt()
  questionId: number;

  @IsString()
  @IsOptional()
  responseText?: string;
}

export class CreateSearchResponseRequestDto {
  @IsInt()
  @Min(1)
  @Max(5)
  stars: number;

  @IsEmail()
  contactEmail: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
