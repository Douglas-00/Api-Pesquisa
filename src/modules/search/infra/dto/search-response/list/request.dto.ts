import { IsString, IsIn } from 'class-validator';

export class ListSearchResponsesParamsDto {
  @IsString({ message: 'O público-alvo é obrigatório e deve ser uma string.' })
  targetAudience: string;

  @IsIn(['asc', 'desc'], { message: 'A ordenação deve ser "asc" ou "desc".' })
  order: 'asc' | 'desc';
}
