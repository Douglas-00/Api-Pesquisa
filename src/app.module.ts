import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './db/prisma.module';
import { LoggerModule } from './modules/logger/logger.module';

@Module({
  imports: [PrismaModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
