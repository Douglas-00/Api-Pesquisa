import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { UpdateSearchUseCase } from './update.useCase';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UpdateSearchUseCase', () => {
  let useCase: UpdateSearchUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSearchUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue({ id: 1 }),
              findFirst: jest.fn().mockResolvedValue(null),
              update: jest.fn().mockResolvedValue(null),
            },
            searchQuestion: {
              update: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<UpdateSearchUseCase>(UpdateSearchUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should update a search successfully', async () => {
    const payload = {
      title: 'Updated Title',
      targetAudience: 'Developers',
      questions: [],
    };
    const result = await useCase.execute(1, payload);

    expect(result).toEqual({ message: 'Search updated successfully!' });
  });

  it('should throw NotFoundException if search is not found', async () => {
    jest.spyOn(prismaService.search, 'findUnique').mockResolvedValueOnce(null);
    const payload = {
      title: 'Test Title',
      targetAudience: 'Developers',
      questions: [],
    };

    await expect(useCase.execute(1, payload)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw ConflictException if duplicate search exists', async () => {
    const payload = {
      title: 'Duplicate Title',
      targetAudience: 'Developers',
      questions: [],
    };
    jest.spyOn(prismaService.search, 'findFirst').mockResolvedValueOnce({
      id: 2,
      title: 'Duplicate Title',
      targetAudience: 'Developers',
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    });

    await expect(useCase.execute(1, payload)).rejects.toThrow(
      ConflictException,
    );
  });
});
