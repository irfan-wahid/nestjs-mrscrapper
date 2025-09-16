import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./infra/database/user.entity";
import { UserController } from "./presentation/user.controller";
import { UserService } from "./application/user.service";
import { KafkaProducer } from "./infra/kafka/kafka.producer";
import { UserRepository } from "./infra/repository/user.repository";
import { RedisModule } from "./infra/redis/redis.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]), 
        RedisModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        KafkaProducer,
        {provide: 'IUserRepository', useClass: UserRepository},
    ],
    exports: [UserService]
})
export class UsersModule {}