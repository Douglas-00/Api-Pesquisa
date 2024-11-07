import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { DeleteSearchResponseDto } from '../../infra/dto/delete/response.dto';

@Injectable()
export class DeleteSearchUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number): Promise<DeleteSearchResponseDto> {
    const existingSearch = await this.prisma.search.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingSearch) {
      throw new NotFoundException('Search not found');
    }

    await this.prisma.search.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return { message: 'Search deleted successfully!' };
  }
}
