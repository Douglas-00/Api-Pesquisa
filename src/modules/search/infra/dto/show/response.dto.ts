export class ShowQuestionDto {
  id: number;
  name: string;
}

export class ShowSearchResponseDto {
  id: number;
  title: string;
  targetAudience: string;
  questions: ShowQuestionDto[];
}
