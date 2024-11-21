import { Module } from "@nestjs/common";
import { FilesService } from "./services/files.service";
import { FilesFactory } from "./factories/files.factory";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule],
    providers: [
        FilesFactory,
        FilesService   
    ],
    exports: [FilesService]
})
export class FilesModule {}