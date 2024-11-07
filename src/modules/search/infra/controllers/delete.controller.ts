import {
  Controller,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { SEARCH_RESOURCE } from './route';
import { DeleteSearchUseCase } from '../../application/useCase/delete.useCase';
import { DeleteSearchResponseDto } from '../dto/delete/response.dto';

@Controller(SEARCH_RESOURCE)
export class DeleteSearchController {
  constructor(private readonly useCase: DeleteSearchUseCase) {}

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteSearch(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteSearchResponseDto> {
    return await this.useCase.execute(id);
  }
}
