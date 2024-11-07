import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ShowSearchResponseDto } from '../../infra/dto/show/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class ShowSearchUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(id: number): Promise<ShowSearchResponseDto> {
    const search = await this.prisma.search.findUnique({
      where: { id },
      include: { questions: true, responses: true },
    });

    if (!search) {
      this.logger.warn(`Search with ID ${id} not found`);
      throw new NotFoundException('Search not found');
    }

    this.logger.log(`Successfully retrieved search with ID ${id}`);
    return {
      id: search.id,
      title: search.title,
      targetAudience: search.targetAudience,
      questions: search.questions.map((q) => ({ name: q.name, id: q.id })),
    };
  }
}
