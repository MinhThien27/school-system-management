import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SubjectsModule } from './subjects/subjects.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        SubjectsModule
    ]
})
export class AppModule {}
