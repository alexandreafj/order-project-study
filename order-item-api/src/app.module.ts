import { Module } from '@nestjs/common';
import { ItemController } from './item/controller/item.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ItemService } from './item/service/item.service';
import { LoggerWinstonService } from './common/helpers/service/logger-winston.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService, LoggerWinstonService],
})
export class AppModule { }
