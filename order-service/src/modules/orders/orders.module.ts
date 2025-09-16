import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KafkaProducer } from "./infra/kafka/kafka.producer";
import { RedisModule } from "./infra/redis/redis.module";
import { OrderEntity } from "./infra/database/order.entity";
import { OrderController } from "./presentation/order.controller";
import { OrderService } from "./application/order.service";
import { OrderRepository } from "./infra/repository/order.repository";
import { KafkaConsumer } from "./infra/kafka/kafka.consumer";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]), 
        RedisModule,
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        KafkaConsumer,
        {provide: 'IOrderRepository', useClass: OrderRepository},
    ],
    exports: [OrderService]
})
export class OrdersModule {}