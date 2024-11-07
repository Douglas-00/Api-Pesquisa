import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ListSearchResponsesParamsDto } from 'src/modules/search/infra/dto/search-response/list/request.dto';
import { ListSearchResponseDto } from 'src/modules/search/infra/dto/search-response/list/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ListSearchResponsesUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(
    searchId: number,
    params: ListSearchResponsesParamsDto,
  ): Promise<ListSearchResponseDto[]> {
    const { targetAudience, order } = params;

    const existingSearch = await this.prisma.search.findUnique({
      where: { id: searchId },
    });

    if (!existingSearch) {
      this.logger.warn(`Search with ID ${searchId} not found`);
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

    this.logger.log(
      `Listed ${responses.length} responses for search ID ${searchId}`,
    );

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
