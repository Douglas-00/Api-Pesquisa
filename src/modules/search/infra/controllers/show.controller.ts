import {
  Controller,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from './route';
import { ShowSearchUseCase } from '../../application/useCase/show.useCase';
import { ShowSearchResponseDto } from '../dto/show/response.dto';

@Controller(SEARCH_RESOURCE)
export class ShowSearchController {
  constructor(private readonly useCase: ShowSearchUseCase) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async showSearch(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShowSearchResponseDto> {
    return await this.useCase.execute(id);
  }
}
