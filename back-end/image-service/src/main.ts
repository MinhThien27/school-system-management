import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const RABBITMQ_URL = configService.get<string>('RABBITMQ_URL');
  const IMAGE_QUEUE_NAME = configService.get<string>('IMAGE_QUEUE_NAME');
  const PORT = configService.get<string>('PORT');
  const microserviceOptions: MicroserviceOptions = {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: IMAGE_QUEUE_NAME,
      queueOptions: {
        durable: true
      },
      noAck: true
    }
  }
  app.connectMicroservice<MicroserviceOptions>(microserviceOptions);
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    logger.log(`Image service ready to receive RabbitMQ message or Http request on PORT: ${PORT}`);
  })
}
bootstrap();
