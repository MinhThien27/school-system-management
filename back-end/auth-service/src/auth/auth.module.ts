import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema.";
import { AuthRepository } from "./repositories/auth.repository";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        ConfigModule,
        RmqClientsModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthRepository
    ],
    exports: [AuthRepository]
})
export class AuthModule {}