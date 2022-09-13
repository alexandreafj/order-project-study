import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemController } from './item/controller/item.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ItemService } from './item/service/item.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
  controllers: [AppController, ItemController],
  providers: [AppService, ItemService],
})
export class AppModule { }
