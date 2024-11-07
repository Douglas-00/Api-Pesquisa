import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SEARCH_RESOURCE } from './route';
import { ListSearchUseCase } from '../../application/useCase/list.useCase';
import { ListSearchResponsesDto } from '../dto/list/response.dto';

@Controller(SEARCH_RESOURCE)
export class ListSearchController {
  constructor(private readonly useCase: ListSearchUseCase) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async listSearch(): Promise<ListSearchResponsesDto[]> {
    return await this.useCase.execute();
  }
}
