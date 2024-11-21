import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqClientsModule } from './rmq-clients/rmq-clients.module';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { DepartmentsModule } from './departments/departments.module';
import { AllExceptionsFilter } from './exception-filters';
import { ClassesModule } from './classes/classes.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { LevelsModule } from './levels/levels.module';
import { SchoolConfigurationsModule } from './school-configurations/school-configurations.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                store: typeof redisStore,
                ttl: 5 * 1000, 
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT')
            }),
            inject: [ConfigService]
        }),
        RmqClientsModule,
        AuthModule,
        StudentsModule,
        TeachersModule,
        SubjectsModule,
        DepartmentsModule,
        ClassesModule,
        AcademicYearsModule,
        LevelsModule,
        SchoolConfigurationsModule
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter
        },
        // {
        //     provide: APP_INTERCEPTOR,
        //     useClass: CacheInterceptor
        // }
    ]
})
export class AppModule { }
