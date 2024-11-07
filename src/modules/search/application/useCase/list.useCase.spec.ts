import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { ListSearchUseCase } from './list.useCase';
import { NotFoundException } from '@nestjs/common';
import {
  ListSearchResponsesDto,
  QuestionDto,
} from '../../infra/dto/list/response.dto';

describe('ListSearchUseCase', () => {
  let useCase: ListSearchUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListSearchUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<ListSearchUseCase>(ListSearchUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return a list of searches', async () => {
    const searches: ListSearchResponsesDto[] = [
      {
        id: 1,
        title: 'Search 1',
        targetAudience: 'Developers',
        questions: [] as QuestionDto[],
      },
      {
        id: 2,
        title: 'Search 2',
        targetAudience: 'Designers',
        questions: [] as QuestionDto[],
      },
    ];
    jest
      .spyOn(prismaService.search, 'findMany')
      .mockResolvedValueOnce(searches as any);

    const result = await useCase.execute();
    expect(result).toEqual(searches);
  });

  it('should throw NotFoundException if no searches are found', async () => {
    await expect(useCase.execute()).rejects.toThrow(NotFoundException);
  });
});
