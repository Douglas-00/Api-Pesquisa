import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { DeleteSearchResponseDto } from '../../infra/dto/delete/response.dto';
import { AppLogger } from 'src/modules/logger/logger.service';

@Injectable()
export class DeleteSearchUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async execute(id: number): Promise<DeleteSearchResponseDto> {
    const existingSearch = await this.prisma.search.findUnique({
      where: { id, deletedAt: null },
    });

    if (!existingSearch) {
      this.logger.warn(`Search with ID ${id} not found`);
      throw new NotFoundException('Search not found');
    }

    await this.prisma.search.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    this.logger.log(`Search with ID ${id} successfully deleted`);
    return { message: 'Search deleted successfully!' };
  }
}
