import { Module } from '@nestjs/common';
import { PrismaModule } from './db/prisma.module';
import { LoggerModule } from './modules/logger/logger.module';
import { SearchModule } from './modules/search/search.module';
import { QuestionModule } from './modules/question/question.module';
import { ResponseModule } from './modules/response/response.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    SearchModule,
    QuestionModule,
    ResponseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
