import { Module } from "@nestjs/common";
import { RmqClientsModule } from "src/rmq-clients/rmq-clients.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./services/auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        ConfigModule,
        RmqClientsModule
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard
        }
    ]
})
export class AuthModule {}