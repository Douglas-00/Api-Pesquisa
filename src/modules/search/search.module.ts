import { Module } from '@nestjs/common';
import { CreateSearchUseCase } from './application/useCase/create.useCase';
import { DeleteSearchUseCase } from './application/useCase/delete.useCase';
import { ShowSearchUseCase } from './application/useCase/show.useCase';
import { ListSearchUseCase } from './application/useCase/list.useCase';
import { UpdateSearchUseCase } from './application/useCase/update.useCase';
import { CreateSearchController } from './infra/controllers/create.controller';
import { DeleteSearchController } from './infra/controllers/delete.controller';
import { ListSearchController } from './infra/controllers/list.controller';
import { ShowSearchController } from './infra/controllers/show.controller';
import { UpdateSearchController } from './infra/controllers/update.controller';
import { CreateSearchResponseUseCase } from './application/useCase/search-response/create.useCase';
import { ListSearchResponsesUseCase } from './application/useCase/search-response/list.useCase';
import { CreateSearchResponseController } from './infra/controllers/search-response/create.controller';
import { ListSearchResponsesController } from './infra/controllers/search-response/list.controller';
import { ExportSearchResponsesToCsvUseCase } from './application/useCase/search-response/exportCSV.useCase';
import { ExportSearchResponsesController } from './infra/controllers/search-response/exportCSV.controller';

@Module({
  imports: [],
  controllers: [
    CreateSearchController,
    DeleteSearchController,
    ListSearchController,
    ShowSearchController,
    UpdateSearchController,
    CreateSearchResponseController,
    ListSearchResponsesController,
    ExportSearchResponsesController,
  ],
  providers: [
    CreateSearchUseCase,
    DeleteSearchUseCase,
    ShowSearchUseCase,
    ListSearchUseCase,
    UpdateSearchUseCase,
    CreateSearchResponseUseCase,
    ListSearchResponsesUseCase,
    ExportSearchResponsesToCsvUseCase,
  ],
})
export class SearchModule {}
