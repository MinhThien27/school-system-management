import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SchoolConfigurationsModule } from './school-configurations/school-configurations.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        DatabaseModule,
        SchoolConfigurationsModule
    ]
})
export class AppModule {}