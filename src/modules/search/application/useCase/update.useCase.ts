import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UpdateSearchRequestDto } from '../../infra/dto/update/request.dto';
import { UpdateSearchResponseDto } from '../../infra/dto/update/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class UpdateSearchUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(
    id: number,
    payload: UpdateSearchRequestDto,
  ): Promise<UpdateSearchResponseDto> {
    const existingSearch = await this.prisma.search.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!existingSearch) {
      this.logger.warn(`Search with ID ${id} not found`);
      throw new NotFoundException('Search not found');
    }

    const duplicateSearch = await this.prisma.search.findFirst({
      where: {
        title: payload.title,
        targetAudience: payload.targetAudience,
        NOT: { id },
      },
    });

    if (duplicateSearch) {
      this.logger.warn(
        `Duplicate search found for title: ${payload.title} and targetAudience: ${payload.targetAudience}`,
      );
      throw new ConflictException(
        'A search with this title and target audience already exists',
      );
    }

    await this.prisma.search.update({
      where: { id },
      data: {
        title: payload.title,
        targetAudience: payload.targetAudience,
      },
    });

    this.logger.log(`Search with ID ${id} updated`);

    if (payload.questions) {
      for (const question of payload.questions) {
        if (question.id) {
          await this.prisma.searchQuestion.update({
            where: { id: question.id },
            data: { name: question.name },
          });
          this.logger.log(
            `Question with ID ${question.id} updated for search ID ${id}`,
          );
        } else {
          await this.prisma.searchQuestion.create({
            data: { name: question.name, searchId: id },
          });
          this.logger.log(`New question created for search ID ${id}`);
        }
      }
    }

    return { message: 'Search updated successfully!' };
  }
}
