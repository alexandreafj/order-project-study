import { Module } from '@nestjs/common';
import { ItemController } from './item/controller/item.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { ItemService } from './item/service/item.service';
import { LoggerWinstonService } from './common/helpers/service/logger-winston.service';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entitys/item.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    RedisModule.forRoot({
      config: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        namespace: process.env.REDIS_NAMESPACE || 'default',
      },
      closeClient: true,
      readyLog: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      socketPath: process.env.NODE_ENV === 'production' ? process.env.INSTANCE_UNIX_SOCKET : null,
      host: process.env.NODE_ENV !== 'production' ? process.env.MYSQL_HOST : null,
      port: Number(process.env.MYSQL_PORT) || 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'orders',
      entities: [Item],
      synchronize: process.env.NODE_ENV === 'production' ? false : true,
    }),
  ],
  controllers: [ItemController],
  providers: [ItemService, LoggerWinstonService],
})
export class AppModule { }
