import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../database/order.entity";
import { Repository } from "typeorm";
import { Order } from "../../domain/order.entity";
import { OrderStatus } from "../../domain/order-status.enum";
import { IOrderRepository } from "../../domain/order.repository";

@Injectable()
export class OrderRepository implements IOrderRepository{
    constructor(
        @InjectRepository(OrderEntity)
        private readonly repo: Repository<OrderEntity>
    ){}

    async create(order: Order): Promise<OrderEntity> {
        const entity = this.repo.create({
            id: order.id,
            userId: order.userId,
            product: order.product,
            price: order.price,
            status: order.status as OrderStatus,
            createdAt: order.createdAt,
        });

    await this.repo.save(entity);
    return entity;
}

    async findAll(): Promise<Order[]> {
        const entities = await this.repo.find();
        return entities.map(e => new Order(e.userId, e.product, e.price, e.status, e.id, e.createdAt))
    }

    async findByUserId(id: string): Promise<Order | null> {
        const entity = await this.repo.findOne({where: { userId: id }})
        if(!entity){
            return null
        }

        return new Order(entity.userId, entity.product, entity.price, entity.status, entity.id, entity.createdAt)
    }

    async findById(id: string): Promise<Order | null> {
        const entity = await this.repo.findOne({where: { id }})
        if(!entity){
            return null
        }

        return new Order(entity.userId, entity.product, entity.price, entity.status, entity.id, entity.createdAt)
    }

    async update(id: string, order: Partial<Order>): Promise<Order | null> {
        await this.repo.update(id, order);
        const updated = await this.repo.findOne({ where: { id } });
        if (!updated) {
            return null;
        }
        
        return new Order(updated.userId, updated.product, updated.price, updated.status, updated.id, updated.createdAt);
    }

    async delete(id: string): Promise<boolean>{
        const result = await this.repo.delete(id);
        return result.affected !== 0;
    }
}