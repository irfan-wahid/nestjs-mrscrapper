import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, Producer } from "kafkajs";

@Injectable() //Menandakan bahwa class ini bisa diinject ke service lain dengan dependency injection
export class KafkaProducer implements OnModuleInit{ //OnModuleInit adalah lifecycle dari NestJS, otomatis memanggil method ini seteleh semua dependency module selesai dibut
    private kafka = new Kafka({ brokers: ['localhost:9092'] });
    private producer: Producer = this.kafka.producer();

    async onModuleInit() {
        await this.producer.connect();
    }

    async sendMessage(topic: string, message: any){
        await this.producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        console.log(`Sent message to topic ${topic}:`, message);
    }
}