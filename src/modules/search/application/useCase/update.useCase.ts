import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { UpdateSearchRequestDto } from '../../infra/dto/update/request.dto';
import { UpdateSearchResponseDto } from '../../infra/dto/update/response.dto';

@Injectable()
export class UpdateSearchUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    id: number,
    payload: UpdateSearchRequestDto,
  ): Promise<UpdateSearchResponseDto> {
    const existingSearch = await this.prisma.search.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!existingSearch) {
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

    if (payload.questions) {
      for (const question of payload.questions) {
        if (question.id) {
          await this.prisma.searchQuestion.update({
            where: { id: question.id },
            data: { name: question.name },
          });
        } else {
          await this.prisma.searchQuestion.create({
            data: {
              name: question.name,
              searchId: id,
            },
          });
        }
      }
    }

    return {
      message: 'Search updated successfully!',
    };
  }
}
