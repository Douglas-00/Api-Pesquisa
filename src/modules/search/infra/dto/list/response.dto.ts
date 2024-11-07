export class QuestionDto {
  id: number;
  name: string;
}

export class ListSearchResponsesDto {
  id: number;
  title: string;
  targetAudience: string;
  questions: QuestionDto[];
}
