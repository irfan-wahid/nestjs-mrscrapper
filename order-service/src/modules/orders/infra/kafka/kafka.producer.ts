import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";

@Injectable()
export class KafkaProducer implements OnModuleInit{
    private kafka = new Kafka({ brokers: ['localhost:9092'] });
    private producer: Producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async sendMessage(topic: string, message: any){
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        })
    }
}