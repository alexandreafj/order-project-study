import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { LoggerWinstonService } from '../service/logger-winston.service';
import { WinstonLevels } from '../class/winston-levels.enum';
import { CacheMethods } from './cache.interface';

export enum ExpireFormat {
    Minutes = 'm',
    Hour = 'h',
    Days = 'd',
}

@Injectable()
export class CacheService implements CacheMethods {
    private readonly expireInMinutes = 60;
    private readonly expireInHours = 60 * 60;
    private readonly expireInDays = this.expireInHours * 24;

    constructor(
        @InjectRedis(process.env.REDIS_NAMESPACE) private readonly redis: Redis,
        private readonly logger: LoggerWinstonService,
    ) { }

    async set(key: string, value: any, expireFormat: ExpireFormat.Hour, expire = 1): Promise<string> {
        try {
            const typeExpiration = {
                m: this.expireInMinutes * expire,
                h: this.expireInHours * expire,
                d: this.expireInDays * expire,
            };
            const expireIn = typeExpiration[expireFormat] || this.expireInMinutes * expire;
            const response = await this.redis.set(key, JSON.stringify(value), 'EX', expireIn);
            return response;
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        }
    }

    async get(key: string): Promise<any> {
        try {
            return this.redis.get(key);
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        }
    }

    async del(key: string): Promise<void> {
        try {
            const patternKey = `${key}:*`;
            const redisKeys = await this.redis.keys(patternKey);
            const hasKeysToDelete = redisKeys.length > 0;
            if (hasKeysToDelete === false) {
                return;
            }
            new Promise((resolve, reject) => {
                const transaction = this.redis.multi();
                redisKeys.forEach((key) => transaction.del(key));
                transaction.exec((err, reply) => {
                    if (err) reject(err);
                    resolve(reply);
                });
            })
        } catch (error) {
            this.logger.log(WinstonLevels.Error, JSON.stringify(error));
        }
    }
}