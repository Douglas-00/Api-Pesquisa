import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { CreateSearchResponseUseCase } from './create.useCase';
import { NotFoundException } from '@nestjs/common';
import { CreateSearchResponseRequestDto } from 'src/modules/search/infra/dto/search-response/create/request.dto';

describe('CreateSearchResponseUseCase', () => {
  let useCase: CreateSearchResponseUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSearchResponseUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                title: 'Search',
                targetAudience: 'Developers',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              }),
            },
            searchResponse: {
              create: jest.fn().mockResolvedValue({ id: 1 }),
            },
            searchQuestion: {
              findFirst: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Question',
                searchId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
              }),
            },
            questionResponse: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                questionId: 1,
                responseId: 1,
                answer: 'Answer',
              }),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<CreateSearchResponseUseCase>(
      CreateSearchResponseUseCase,
    );
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create a new response for search', async () => {
    const payload: CreateSearchResponseRequestDto = {
      stars: 5,
      contactEmail: 'test@example.com',
      answers: [
        {
          questionId: 1,
          responseText: 'Yes',
        },
      ],
    };

    const result = await useCase.execute(1, payload);
    expect(result).toEqual({ message: 'Response created successfully!' });
  });

  it('should throw NotFoundException if search is not found', async () => {
    jest.spyOn(prismaService.search, 'findUnique').mockResolvedValueOnce(null);

    const payload: CreateSearchResponseRequestDto = {
      stars: 5,
      contactEmail: 'test@example.com',
      answers: [
        {
          questionId: 1,
          responseText: 'Yes',
        },
      ],
    };

    await expect(useCase.execute(1, payload)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if question is not found', async () => {
    jest
      .spyOn(prismaService.searchQuestion, 'findFirst')
      .mockResolvedValueOnce(null);

    const payload: CreateSearchResponseRequestDto = {
      stars: 5,
      contactEmail: 'test@example.com',
      answers: [
        {
          questionId: 1,
          responseText: 'Yes',
        },
      ],
    };

    await expect(useCase.execute(1, payload)).rejects.toThrow(
      NotFoundException,
    );
  });
});
