import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImagesModule } from './images/images.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ImagesModule,
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        })
    ]
})
export class AppModule {}
