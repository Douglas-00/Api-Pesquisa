import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { NotFoundException } from '@nestjs/common';
import { ListSearchResponsesParamsDto } from 'src/modules/search/infra/dto/search-response/list/request.dto';
import { ListSearchResponsesUseCase } from './list.useCase';

describe('ListSearchResponsesUseCase', () => {
  let useCase: ListSearchResponsesUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSearchResponsesUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                title: 'Sample Search',
                targetAudience: 'Developers',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              }),
            },
            searchResponse: {
              findMany: jest.fn().mockResolvedValue([
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
                      createdAt: new Date(),
                      updatedAt: new Date(),
                      deletedAt: null,
                    },
                  ],
                },
              ]),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<ListSearchResponsesUseCase>(
      ListSearchResponsesUseCase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should list search responses for given parameters', async () => {
    const params: ListSearchResponsesParamsDto = {
      targetAudience: 'Developers',
      order: 'asc',
    };

    const result = await useCase.execute(1, params);
    expect(result).toEqual([
      {
        id: 1,
        targetAudience: 'Developers',
        stars: 5,
        answers: [{ questionId: 1, responseText: 'Yes' }],
      },
    ]);
  });

  it('should throw NotFoundException if search not found', async () => {
    jest.spyOn(prismaService.search, 'findUnique').mockResolvedValueOnce(null);

    const params: ListSearchResponsesParamsDto = {
      targetAudience: 'Developers',
      order: 'asc',
    };

    await expect(useCase.execute(1, params)).rejects.toThrow(NotFoundException);
  });
});
