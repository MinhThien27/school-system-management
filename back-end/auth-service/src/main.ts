import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  const AUTH_QUEUE_NAME = configService.get<string>('AUTH_QUEUE_NAME');
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: AUTH_QUEUE_NAME,
      queueOptions: {
        durable: true
      },
      noAck: true
    }
  }
  app.connectMicroservice<MicroserviceOptions>(microserviceOptions);
  await app.startAllMicroservices();
  await app.init();
}
bootstrap();