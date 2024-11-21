import { Module } from '@nestjs/common';
import { LevelsModule } from './levels/levels.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot(),
        LevelsModule
    ]
})
export class AppModule {}
