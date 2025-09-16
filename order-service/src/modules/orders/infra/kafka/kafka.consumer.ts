import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaConsumer implements OnModuleInit, OnModuleDestroy {
    private kafka = new Kafka({ brokers: ['localhost:9092'] });
    private consumer: Consumer = this.kafka.consumer({ groupId: 'order-service-group' });

    async onModuleInit() {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: 'user.created', fromBeginning: true });
            await this.consumer.run({
                eachMessage: async ({ topic, message }) => {
                    const value = message.value?.toString();
                    const parsed = value ? JSON.parse(value) : null;
                    console.log(`Received message on topic ${topic}:`, parsed);
                },
            });
        } catch (err) {
            console.error('Kafka consumer error:', err);
        }
    }

    async onModuleDestroy() {
        await this.consumer.disconnect();
    }
}