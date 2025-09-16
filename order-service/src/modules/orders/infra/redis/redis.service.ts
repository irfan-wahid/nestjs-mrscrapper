import { Injectable, OnModuleInit } from "@nestjs/common";
import { createClient, RedisClientType } from "redis";

@Injectable()
export class RedisService implements OnModuleInit{
    private client: RedisClientType;

    async onModuleInit() {
        this.client = createClient({
            url: 'redis://localhost:6380',
        });

        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async get(key: string): Promise<string | null>{
        return this.client.get(key);
    }

    async set(key: string, value: string, ttl?: number): Promise<void>{
        if(ttl){
            await this.client.set(key, value, {EX:ttl});
        }else{
            await this.client.set(key, value);
        }
    }
}