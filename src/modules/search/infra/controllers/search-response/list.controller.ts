import {
  Controller,
  Get,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from '../route';
import { ListSearchResponsesUseCase } from 'src/modules/search/application/useCase/search-response/list.useCase';
import { ListSearchResponseDto } from '../../dto/search-response/list/response.dto';
import { ListSearchResponsesParamsDto } from '../../dto/search-response/list/request.dto';

@Controller(SEARCH_RESOURCE)
export class ListSearchResponsesController {
  constructor(private readonly useCase: ListSearchResponsesUseCase) {}

  @Get(':searchId/responses')
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.OK)
  async listResponses(
    @Param('searchId', ParseIntPipe) searchId: number,
    @Query() params: ListSearchResponsesParamsDto,
  ): Promise<ListSearchResponseDto[]> {
    return await this.useCase.execute(searchId, params);
  }
}
