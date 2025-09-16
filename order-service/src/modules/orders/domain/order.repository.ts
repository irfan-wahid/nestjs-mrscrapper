import { Order } from "./order.entity";

export interface IOrderRepository {
    create(order: Order): Promise<Order>;
    findAll(): Promise<Order[]>;
    findByUserId(id: string): Promise<Order | null>;
}