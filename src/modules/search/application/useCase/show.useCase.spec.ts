import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/db/prisma.service';
import { AppLogger } from 'src/modules/logger/logger.service';
import { ShowSearchUseCase } from './show.useCase';
import { NotFoundException } from '@nestjs/common';
import {
  ShowSearchResponseDto,
  ShowQuestionDto,
} from '../../infra/dto/show/response.dto';

describe('ShowSearchUseCase', () => {
  let useCase: ShowSearchUseCase;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowSearchUseCase,
        {
          provide: PrismaService,
          useValue: {
            search: {
              findUnique: jest.fn().mockResolvedValue(null),
            },
          },
        },
        AppLogger,
      ],
    }).compile();

    useCase = module.get<ShowSearchUseCase>(ShowSearchUseCase);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should return a search by ID', async () => {
    const search: ShowSearchResponseDto = {
      id: 1,
      title: 'Test Search',
      targetAudience: 'Developers',
      questions: [] as ShowQuestionDto[],
    };
    jest
      .spyOn(prismaService.search, 'findUnique')
      .mockResolvedValueOnce(search as any);

    const result = await useCase.execute(1);
    expect(result).toEqual(search);
  });

  it('should throw NotFoundException if search is not found', async () => {
    await expect(useCase.execute(1)).rejects.toThrow(NotFoundException);
  });
});
