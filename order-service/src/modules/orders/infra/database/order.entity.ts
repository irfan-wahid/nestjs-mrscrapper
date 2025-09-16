import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../../domain/order-status.enum";


@Entity('orders')
export class OrderEntity{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    product: string;

    @Column()
    price: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
