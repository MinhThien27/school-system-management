import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TeachersModule } from './teachers/teachers.module';
import { DepartmentsModule } from './departments/departments.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TeachersModule,
        DepartmentsModule
    ]
})
export class AppModule {}