import { Module } from '@nestjs/common';
import { CacheMethodsToken } from './cache.interface';
import { CacheService } from './cache.service';

@Module({
    imports: [],
    providers: [CacheService,
        { provide: CacheMethodsToken, useExisting: CacheService }],
    exports: [CacheMethodsToken],
})
export class CacheModule {
}