import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateSearchResponseRequestDto } from 'src/modules/search/infra/dto/search-response/create/request.dto';
import { CreateSearchResponseResponseDto } from 'src/modules/search/infra/dto/search-response/create/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class CreateSearchResponseUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(
    searchId: number,
    payload: CreateSearchResponseRequestDto,
  ): Promise<CreateSearchResponseResponseDto> {
    const search = await this.prisma.search.findUnique({
      where: { id: searchId, deletedAt: null },
    });

    if (!search) {
      this.logger.warn(`Search with ID ${searchId} not found`);
      throw new NotFoundException('Search not found');
    }

    const response = await this.prisma.searchResponse.create({
      data: {
        searchId,
        targetAudience: search.targetAudience,
        stars: payload.stars,
        contactEmail: payload.contactEmail,
      },
    });

    this.logger.log(
      `Response created with ID ${response.id} for search ID ${searchId}`,
    );

    if (payload.answers && payload.answers.length > 0) {
      for (const answer of payload.answers) {
        const question = await this.prisma.searchQuestion.findFirst({
          where: {
            id: answer.questionId,
            searchId: searchId,
          },
        });

        if (!question) {
          this.logger.warn(
            `Question ${answer.questionId} not found for search ID ${searchId}`,
          );
          throw new NotFoundException(
            `Question ${answer.questionId} Not Found!`,
          );
        }

        await this.prisma.questionResponse.create({
          data: {
            questionId: question.id,
            responseId: response.id,
            answer: answer.responseText,
          },
        });

        this.logger.log(
          `Answer recorded for question ID ${question.id} in response ID ${response.id}`,
        );
      }
    }

    return { message: 'Response created successfully!' };
  }
}
