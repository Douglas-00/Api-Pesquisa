import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ListSearchResponsesParamsDto } from 'src/modules/search/infra/dto/search-response/list/request.dto';
import { ListSearchResponseDto } from 'src/modules/search/infra/dto/search-response/list/response.dto';

@Injectable()
export class ListSearchResponsesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    searchId: number,
    params: ListSearchResponsesParamsDto,
  ): Promise<ListSearchResponseDto[]> {
    const { targetAudience, order } = params;

    const existingSearch = await this.prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!existingSearch) {
      throw new NotFoundException('Search not found');
    }

    const responses = await this.prisma.searchResponse.findMany({
      where: { searchId, targetAudience },
      select: {
        id: true,
        targetAudience: true,
        stars: true,
        questionResponses: {
          select: {
            answer: true,
            questionId: true,
          },
        },
      },
      orderBy: { stars: order },
    });

    return responses.map((response) => ({
      id: response.id,
      targetAudience: response.targetAudience,
      stars: response.stars,
      answers: response.questionResponses.map((qr) => ({
        questionId: qr.questionId,
        responseText: qr.answer,
      })),
    }));
  }
}
