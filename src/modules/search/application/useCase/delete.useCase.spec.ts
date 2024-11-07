import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { DeleteSearchUseCase } from './delete.useCase';
import { NotFoundException } from '@nestjs/common';

describe('DeleteSearchUseCase', () => {
  let useCase: DeleteSearchUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSearchUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue({ id: 1 }),
              update: jest.fn().mockResolvedValue(null),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<DeleteSearchUseCase>(DeleteSearchUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should delete a search successfully', async () => {
    const result = await useCase.execute(1);

    expect(result).toEqual({ message: 'Search deleted successfully!' });
  });

  it('should throw NotFoundException if search does not exist', async () => {
    jest.spyOn(prismaService.search, 'findUnique').mockResolvedValueOnce(null);

    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
