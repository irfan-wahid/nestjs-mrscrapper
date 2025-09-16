import { v4 as uuidv4 } from 'uuid';
import { OrderStatus } from './order-status.enum';

export class Order {
  constructor(
    public userId: string,
    public product: string,
    public price: number,
    public status: OrderStatus = OrderStatus.PENDING,
    public readonly id: string = uuidv4(),
    public readonly createdAt: Date = new Date(),
  ) {}
}