import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClassesModule } from './classes/classes.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ClassesModule
    ]
})
export class AppModule {}
