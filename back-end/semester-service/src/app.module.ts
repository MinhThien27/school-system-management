import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SemestersModule } from './semesters/semesters.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SemestersModule
    ]
})
export class AppModule {}
