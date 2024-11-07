import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from './route';
import { CreateSearchUseCase } from '../../application/useCase/create.useCase';
import { CreateSearchRequestDto } from '../dto/create/request.dto';
import { CreateSearchResponseDto } from '../dto/create/response.dto';

@Controller(SEARCH_RESOURCE)
export class CreateSearchController {
  constructor(private readonly useCase: CreateSearchUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createSearch(
    @Body() payload: CreateSearchRequestDto,
  ): Promise<CreateSearchResponseDto> {
    return await this.useCase.execute(payload);
  }
}
