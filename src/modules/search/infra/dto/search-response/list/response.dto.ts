class AnswerDto {
  questionId: number;
  responseText?: string;
}

export class ListSearchResponseDto {
  id: number;
  targetAudience: string;
  stars: number;
  answers: AnswerDto[];
}
