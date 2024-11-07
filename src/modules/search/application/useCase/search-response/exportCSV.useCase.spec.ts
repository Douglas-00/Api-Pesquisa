import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { ExportSearchResponsesToCsvUseCase } from './exportCSV.useCase';

describe('ExportSearchResponsesToCsvUseCase', () => {
  let useCase: ExportSearchResponsesToCsvUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportSearchResponsesToCsvUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue(null),
            },
            searchResponse: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<ExportSearchResponsesToCsvUseCase>(
      ExportSearchResponsesToCsvUseCase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should export responses to CSV', async () => {
    jest.spyOn(prismaService.search, 'findUnique').mockResolvedValueOnce({
      id: 1,
      title: 'titulo',
      targetAudience: 'Developers',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    jest.spyOn(prismaService.searchResponse, 'findMany').mockResolvedValueOnce([
      {
        id: 1,
        searchId: 1,
        targetAudience: 'Developers',
        stars: 5,
        contactEmail: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        questionResponses: [
          {
            questionId: 1,
            answer: 'Yes',
            searchQuestion: {
              id: 1,
              name: 'Sample Question',
              createdAt: new Date(),
              updatedAt: new Date(),
              deletedAt: null,
            },
          },
        ],
      } as any,
    ]);

    const result = await useCase.execute(1);
    expect(result).toBeDefined();
  });

  it('should throw NotFoundException if search is not found', async () => {
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
