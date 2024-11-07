import {
  Controller,
  Get,
  Param,
  Res,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { ExportSearchResponsesToCsvUseCase } from 'src/modules/search/application/useCase/search-response/exportCSV.useCase';
import { SEARCH_RESOURCE } from '../route';

@Controller(SEARCH_RESOURCE)
export class ExportSearchResponsesController {
  constructor(
    private readonly exportUseCase: ExportSearchResponsesToCsvUseCase,
  ) {}

  @Get('/:searchId/responses/export')
  @HttpCode(HttpStatus.OK)
  async exportResponsesToCsv(
    @Param('searchId', ParseIntPipe) searchId: number,
    @Res() response: Response,
  ): Promise<void> {
    const csv = await this.exportUseCase.execute(searchId);

    response.header('Content-Type', 'text/csv');
    response.setHeader(
      'Content-Disposition',
      `attachment; filename="responses_search_${searchId}.csv"`,
    );
    response.send(csv);
  }
}
