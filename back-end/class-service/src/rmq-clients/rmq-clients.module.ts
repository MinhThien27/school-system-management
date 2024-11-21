import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports: [
        ClientsModule.registerAsync({
            clients: [
                {
                    imports: [ConfigModule],
                    name: 'CLASS_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('CLASS_QUEUE_NAME')
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
                },
                {
                    imports: [ConfigModule],
                    name: 'SUBJECT_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('SUBJECT_QUEUE_NAME')
                            }
                        }
                    },
                    inject: [ConfigService]
                },
                {
                    imports: [ConfigModule],
                    name: 'SEMESTER_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('SEMESTER_QUEUE_NAME')
                            }
                        }
                    },
                    inject: [ConfigService]
                },
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
                    name: 'CURRICULUM_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('CURRICULUM_QUEUE_NAME')
                            }
                        }
                    },
                    inject: [ConfigService]
                },
                {
                    imports: [ConfigModule],
                    name: 'CONFIGURATION_SERVICE',
                    useFactory: (configService: ConfigService) => {
                        return {
                            transport: Transport.RMQ,
                            options: {
                                urls: [configService.get<string>('RABBITMQ_URL')],
                                queue: configService.get<string>('CONFIGURATION_QUEUE_NAME')
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