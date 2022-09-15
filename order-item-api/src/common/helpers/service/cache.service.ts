import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
    constructor(
        @InjectRedis(process.env.REDIS_NAMESPACE) private readonly redis: Redis
    ) { }

    async set(): Promise<any> {
        return this.redis.set('key', 'value', 'EX', 10);
    }

    async get(key: string): Promise<any> {
        return this.redis.get(key);
    }
}