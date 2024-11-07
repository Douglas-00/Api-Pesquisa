import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ListSearchResponsesDto } from '../../infra/dto/list/response.dto';

@Injectable()
export class ListSearchUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<ListSearchResponsesDto[]> {
    const searches = await this.prisma.search.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        title: true,
        targetAudience: true,
        questions: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (searches.length === 0) {
      throw new NotFoundException('Searches not found');
    }

    return searches.map((search) => ({
      id: search.id,
      title: search.title,
      targetAudience: search.targetAudience,
      questions: search.questions,
    }));
  }
}
