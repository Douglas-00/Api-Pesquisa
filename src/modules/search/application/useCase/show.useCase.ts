import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { ShowSearchResponseDto } from '../../infra/dto/show/response.dto';

@Injectable()
export class ShowSearchUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number): Promise<ShowSearchResponseDto> {
    const search = await this.prisma.search.findUnique({
      where: { id },
      include: { questions: true, responses: true },
    });

    if (!search) {
      throw new NotFoundException('Search not found');
    }

    return {
      id: search.id,
      title: search.title,
      targetAudience: search.targetAudience,
      questions: search.questions.map((q) => ({ name: q.name, id: q.id })),
    };
  }
}
