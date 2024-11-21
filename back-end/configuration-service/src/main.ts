import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  const CONFIGURATION_QUEUE_NAME = configService.get<string>('CONFIGURATION_QUEUE_NAME');
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: CONFIGURATION_QUEUE_NAME,
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