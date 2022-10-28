import { ExpireFormat } from "./cache.service";

export const CacheMethodsToken = Symbol('CacheMethods');
export interface CacheMethods {
    set(key: string, value: any, expireFormat?: ExpireFormat, expire?: number): Promise<string>;
    get(key: string): Promise<any>;
    del(key: string): Promise<void>;
}