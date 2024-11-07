import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { LoggerModule } from './modules/logger/logger.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [PrismaModule, LoggerModule, SearchModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
