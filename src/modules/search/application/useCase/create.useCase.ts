import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateSearchRequestDto } from '../../infra/dto/create/request.dto';
import { CreateSearchResponseDto } from '../../infra/dto/create/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class CreateSearchUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(
    payload: CreateSearchRequestDto,
  ): Promise<CreateSearchResponseDto> {
    const existingSearch = await this.prisma.search.findFirst({
      where: {
        title: payload.title,
        targetAudience: payload.targetAudience,
      },
    });

    if (existingSearch) {
      this.logger.warn(`Search already exists`);
      throw new ConflictException(
        'A search with this title and target audience already exists',
      );
    }

    await this.prisma.search.create({
      data: {
        title: payload.title,
        targetAudience: payload.targetAudience,
        questions: {
          create: [
            { name: 'Público-alvo' },
            { name: 'Quantidade de estrelas' },
            { name: 'E-mail para contato' },
            ...(payload.questions
              ? payload.questions.map((q) => ({ name: q.name }))
              : []),
          ],
        },
      },
    });

    return {
      message: 'Search created successfully!',
    };
  }
}
