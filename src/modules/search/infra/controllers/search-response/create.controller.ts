import {
  Controller,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from '../route';
import { CreateSearchResponseUseCase } from 'src/modules/search/application/useCase/search-response/create.useCase';
import { CreateSearchResponseRequestDto } from '../../dto/search-response/create/request.dto';
import { CreateSearchResponseResponseDto } from '../../dto/search-response/create/response.dto';

@Controller(SEARCH_RESOURCE)
export class CreateSearchResponseController {
  constructor(private readonly useCase: CreateSearchResponseUseCase) {}

  @Post(':searchId/responses')
  @HttpCode(HttpStatus.CREATED)
  async createResponse(
    @Param('searchId', ParseIntPipe) searchId: number,
    @Body() payload: CreateSearchResponseRequestDto,
  ): Promise<CreateSearchResponseResponseDto> {
    return await this.useCase.execute(searchId, payload);
  }
}
