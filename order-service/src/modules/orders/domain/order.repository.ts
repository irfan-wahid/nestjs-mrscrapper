import { Order } from "./order.entity";

export interface IOrderRepository {
    create(order: Order): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByUserId(id: string): Promise<Order | null>;
    findById(id: string): Promise<Order | null>;
    update(id: string, order: Partial<Order>): Promise<Order | null>;
    delete(id: string): Promise<boolean>;
}