import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { CreateSearchUseCase } from './create.useCase';
import { ConflictException } from '@nestjs/common';

describe('CreateSearchUseCase', () => {
  let useCase: CreateSearchUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSearchUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findFirst: jest.fn().mockResolvedValue(null),
              create: jest.fn().mockResolvedValue({ id: 1 }),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<CreateSearchUseCase>(CreateSearchUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a new search', async () => {
    const payload = {
      title: 'Test Title',
      targetAudience: 'Developers',
      questions: [],
    };
    const result = await useCase.execute(payload);

    expect(result).toEqual({ message: 'Search created successfully!' });
  });

  it('should throw ConflictException if search already exists', async () => {
    const payload = {
      title: 'Duplicate Title',
      targetAudience: 'Developers',
      questions: [],
    };

    jest.spyOn(prismaService.search, 'findFirst').mockResolvedValueOnce({
      id: 2,
      title: payload.title,
      targetAudience: payload.targetAudience,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    await expect(useCase.execute(payload)).rejects.toThrow(ConflictException);
  });
});
