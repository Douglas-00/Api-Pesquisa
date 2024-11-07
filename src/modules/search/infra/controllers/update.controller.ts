import {
  Controller,
  Put,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from './route';
import { UpdateSearchUseCase } from '../../application/useCase/update.useCase';
import { UpdateSearchRequestDto } from '../dto/update/request.dto';
import { UpdateSearchResponseDto } from '../dto/update/response.dto';

@Controller(SEARCH_RESOURCE)
export class UpdateSearchController {
  constructor(private readonly useCase: UpdateSearchUseCase) {}

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateSearch(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateSearchRequestDto,
  ): Promise<UpdateSearchResponseDto> {
    return await this.useCase.execute(id, payload);
  }
}
