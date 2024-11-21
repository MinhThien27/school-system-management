import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.registerAsync({
            clients: [
                {
                    imports: [ConfigModule],
                    name: 'STUDENT_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('STUDENT_QUEUE_NAME')
                            }
                        }
                    },
                    inject: [ConfigService]
                },
                {
                    imports: [ConfigModule],
                    name: 'TEACHER_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('TEACHER_QUEUE_NAME')
                            }
                        }
                    },
                    inject: [ConfigService]
                }
            ],
            // isGlobal: true
        })
    ],
    exports: [ClientsModule]
})
export class RmqClientsModule {}