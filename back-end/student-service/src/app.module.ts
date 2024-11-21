import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { StudentsModule } from './students/students.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        StudentsModule
    ]
})
export class AppModule {}
