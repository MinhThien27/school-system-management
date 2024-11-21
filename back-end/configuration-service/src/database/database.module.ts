import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { DatabaseService } from "./services/database.service";
import { SchoolConfigurationsModule } from "src/school-configurations/school-configurations.module";

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                return {
                    uri: configService.get<string>('MONGODB_URL')
                }
            },
            inject: [ConfigService]
        }),
        forwardRef(() => SchoolConfigurationsModule)
    ],
    providers: [DatabaseService]
})
export class DatabaseModule {}